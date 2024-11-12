export default function ChatLayout({
  children,
  device
}: {
  children: React.ReactNode
  device: string
}) {
  console.log(device)
  return <section>{children}</section>
}