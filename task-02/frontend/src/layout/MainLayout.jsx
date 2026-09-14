import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import "../styles/mainLayout.css";

function MainLayout({ children, showSideMenu = false }) {
  return (
    <>
      <div className="main-layout">
        {showSideMenu && (
          <aside className="layout-sidebar">
            <SideMenu fixed={true} />
          </aside>
        )}

        <main className="layout-content">
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default MainLayout;
