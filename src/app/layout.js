import "./globals.css";

export const metadata = {
  title: "MCQ Quiz App",
  description: "Interactive MCQ Quiz Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
