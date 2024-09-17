import PopupPortal from "../PopupPortal/PopupPortal";

const FooterModal = () => {
  return (
    <PopupPortal>
      <div
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        {/* Modal content */}
        <h2 className="text-lg font-semibold">Footer Modal</h2>
        <p>This is a modal that appears at the bottom of the page.</p>
      </div>
    </PopupPortal>
  );
};

export default FooterModal;
