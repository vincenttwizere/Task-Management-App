const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendTeamInvitation = functions.firestore
    .document('teamMembers/{memberId}')
    .onCreate(async (snap, context) => {
        const inviteData = snap.data();
        const inviteeEmail = inviteData.email;
        const teamOwnerId = inviteData.teamOwnerId;

        try {
            // Get the team owner's details
            const ownerDoc = await admin.auth().getUser(teamOwnerId);
            const ownerName = ownerDoc.displayName || ownerDoc.email;

            // Create a custom action code settings
            const actionCodeSettings = {
                url: `${functions.config().app.url}/team/accept-invite?inviteId=${context.params.memberId}`,
                handleCodeInApp: true,
            };

            // Send the invitation email
            await admin.auth().generateSignInWithEmailLink(inviteeEmail, actionCodeSettings);

            // Update the invitation with sent status
            await snap.ref.update({
                emailSent: true,
                sentAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Team invitation email sent to ${inviteeEmail}`);
            return null;
        } catch (error) {
            console.error('Error sending team invitation:', error);
            await snap.ref.update({
                emailSent: false,
                error: error.message
            });
            throw error;
        }
    }); 