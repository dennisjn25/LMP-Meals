"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import crypto from "crypto";

const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    token: z.string()
});

// Generate a password reset token
export const requestPasswordReset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        // Don't reveal if user exists or not for security
        return { success: "If an account exists with this email, you will receive a password reset link." };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Token expires in 1 hour
    const expires = new Date(Date.now() + 3600000);

    // Delete any existing reset tokens for this email
    await db.passwordResetToken.deleteMany({
        where: { email }
    });

    // Create new reset token
    await db.passwordResetToken.create({
        data: {
            email,
            token: hashedToken,
            expires
        }
    });

    // In production, you would send an email here with the reset link
    // For now, we'll log it to console for development
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/new-password?token=${resetToken}`;

    console.log('🔐 Password Reset Link:', resetUrl);
    console.log('📧 This would be sent to:', email);

    // Send password reset email
    try {
        const { sendPasswordResetEmail } = await import("@/lib/email");
        await sendPasswordResetEmail({
            email,
            resetUrl
        });
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        // Don't fail the request if email fails - still return success for security
        // return { error: "Failed to send reset email. Please try again." };
    }


    return { success: "If an account exists with this email, you will receive a password reset link." };
};

// Reset password with token
export const resetPassword = async (values: z.infer<typeof NewPasswordSchema>) => {
    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password, token } = validatedFields.data;

    // Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid token
    const passwordResetToken = await db.passwordResetToken.findUnique({
        where: { token: hashedToken }
    });

    if (!passwordResetToken) {
        return { error: "Invalid or expired reset token!" };
    }

    // Check if token is expired
    if (new Date() > passwordResetToken.expires) {
        await db.passwordResetToken.delete({
            where: { id: passwordResetToken.id }
        });
        return { error: "Reset token has expired!" };
    }

    // Find user
    const user = await db.user.findUnique({
        where: { email: passwordResetToken.email }
    });

    if (!user) {
        return { error: "User not found!" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    // Delete used token
    await db.passwordResetToken.delete({
        where: { id: passwordResetToken.id }
    });

    return { success: "Password updated successfully!" };
};

// Verify if a reset token is valid
export const verifyResetToken = async (token: string) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const passwordResetToken = await db.passwordResetToken.findUnique({
        where: { token: hashedToken }
    });

    if (!passwordResetToken) {
        return { error: "Invalid token!" };
    }

    if (new Date() > passwordResetToken.expires) {
        await db.passwordResetToken.delete({
            where: { id: passwordResetToken.id }
        });
        return { error: "Token has expired!" };
    }

    return { success: "Token is valid!", email: passwordResetToken.email };
};
