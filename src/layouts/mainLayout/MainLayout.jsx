import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import "./MainLayout.scss";
export default function MainLayout({ children }) {
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="wrapContent">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
