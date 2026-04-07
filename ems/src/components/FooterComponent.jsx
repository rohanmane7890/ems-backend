import React from "react";

const FooterComponent = () => {
  return (
    <footer className='footer py-4 border-top mt-5' style={{ backgroundColor: "#0f172a", color: "rgba(255, 255, 255, 0.5)", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="container text-center">
            <span className='small fw-medium tracking-wider'>
                © {new Date().getFullYear()} <span className="text-primary fw-bold">NexGen Workforce</span>. All Rights Reserved.
            </span>
        </div>
      </footer>
  );
};

export default FooterComponent;
