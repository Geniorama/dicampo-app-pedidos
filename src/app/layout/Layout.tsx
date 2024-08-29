import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Header />
        <main className="p-4 w-full max-w-md mx-auto min-h-[calc(100vh_-_128px)]">
        {props.children}
        </main>
      <Footer />
    </>
  );
}
