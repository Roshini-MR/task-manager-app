const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const sendTaskCreatedEmail = async (to, name, taskTitle) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ New Task Created — TaskFlow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 48px; height: 48px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: white;">T</div>
          <h2 style="color: #ffffff; margin-top: 12px;">TaskFlow</h2>
        </div>
        <h3 style="color: #a5b4fc;">Hey ${name}! 👋</h3>
        <p style="color: #a1a1aa;">A new task has been created for you:</p>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="color: #ffffff; font-weight: bold; margin: 0;">📋 ${taskTitle}</p>
        </div>
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 24px;">TaskFlow — Smart Task Management</p>
      </div>
    `
  })
}

const sendDueDateReminderEmail = async (to, name, taskTitle, dueDate) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⚠️ Task Due Tomorrow — TaskFlow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 48px; height: 48px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: white;">T</div>
          <h2 style="color: #ffffff; margin-top: 12px;">TaskFlow</h2>
        </div>
        <h3 style="color: #fbbf24;">⚠️ Due Date Reminder</h3>
        <p style="color: #a1a1aa;">Hey ${name}, this task is due tomorrow!</p>
        <div style="background: #18181b; border: 1px solid #f59e0b50; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="color: #ffffff; font-weight: bold; margin: 0;">📋 ${taskTitle}</p>
          <p style="color: #fbbf24; font-size: 13px; margin: 8px 0 0;">Due: ${new Date(dueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 24px;">TaskFlow — Smart Task Management</p>
      </div>
    `
  })
}

const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🎉 Welcome to TaskFlow!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); width: 48px; height: 48px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: white;">T</div>
          <h2 style="color: #ffffff; margin-top: 12px;">TaskFlow</h2>
        </div>
        <h3 style="color: #a5b4fc;">Welcome, ${name}! 🎉</h3>
        <p style="color: #a1a1aa;">Your account has been created successfully. Start managing your tasks like a pro!</p>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="color: #a1a1aa; margin: 0 0 8px; font-size: 13px;">✅ Create and manage tasks</p>
          <p style="color: #a1a1aa; margin: 0 0 8px; font-size: 13px;">📋 Kanban board with drag & drop</p>
          <p style="color: #a1a1aa; margin: 0 0 8px; font-size: 13px;">📊 Dashboard with charts</p>
          <p style="color: #a1a1aa; margin: 0; font-size: 13px;">🔔 Real-time notifications</p>
        </div>
        <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 24px;">TaskFlow — Smart Task Management</p>
      </div>
    `
  })
}

module.exports = { sendTaskCreatedEmail, sendDueDateReminderEmail, sendWelcomeEmail }