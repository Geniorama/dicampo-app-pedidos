import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Header />
        <main className="w-full max-w-md mx-auto h-[calc(100vh_-_128px)]">
        {props.children}
        </main>
      <Footer />
    </>
  );
}
