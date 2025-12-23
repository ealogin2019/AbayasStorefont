import { RequestHandler } from "express";

export const handleContact: RequestHandler = (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simple server-side logging - in production you'd send an email or store this in a DB
  console.log("Contact form submission:", { name, email, message });

  res
    .status(200)
    .json({
      message: "Thanks for your message. We'll get back to you shortly.",
    });
};
