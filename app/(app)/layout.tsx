import { Nvabar } from "@/components/nvabar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      <Nvabar />
      {children}
    </div>
  );
}
