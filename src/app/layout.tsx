import './globals.css';
export const metadata = {
  title: 'artbop.',
  description: 'Mix up your life',
}

export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
      {children}
    </body>
    </html>
  )
}
