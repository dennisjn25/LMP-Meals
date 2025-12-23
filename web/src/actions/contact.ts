"use server";

import { sendContactEmail } from "@/lib/email";
import { z } from "zod";

// Validation schema for contact form
const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

export async function submitContactForm(formData: FormData) {
    try {
        // Extract and validate form data
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        };

        // Validate using Zod schema
        const validatedData = contactFormSchema.parse(rawData);

        // Send email
        await sendContactEmail(validatedData);

        return {
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
        };
    } catch (error) {
        console.error("Contact form submission error:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.issues[0].message,
            };
        }

        return {
            success: false,
            message: "Failed to send message. Please try again or email us directly.",
        };
    }
}
