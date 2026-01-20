import { CssBaseline } from "@mui/material";

export const metadata = {
  title: "Modern Tech Blog",
  description: "High-quality blogs on development, design & tech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
