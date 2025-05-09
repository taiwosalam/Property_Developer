import React, { useRef, useState } from "react";
import SignaturePad, {
  ReactSignatureCanvasProps,
} from "react-signature-canvas";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";
import { RedoSigArrow, UndoSigArrow } from "@/public/icons/icons";
import ReactSignatureCanvas from "react-signature-canvas";
import useStep from "@/hooks/useStep";
import AddMultipleLandlordsOrTenants from "../add-multiple-landlords-or-tenants";
import UploadSignature from "./signature-component";
import Button from "@/components/Form/Button/button";

interface SignatureModalProps {
  onCreateSignature: (
    imageBase64: string,
    index: number,
    imageFile?: File
  ) => void; // updated to pass index
  index: number; // pass index from parent
}

// Extend the existing props interface to include onEnd
interface ExtendedSignatureCanvasProps extends ReactSignatureCanvasProps {
  onEnd?: () => void;
  penColor?: string;
  ref: React.RefObject<SignaturePad>;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  onCreateSignature,
  index,
}) => {
  const { setIsOpen } = useModal();
  const sigPadRef = useRef<SignaturePad>(null);
  const [signatureImageBase64, setSignatureImageBase64] = useState<
    string | null
  >(null);
  const [signatureImageFile, setSignatureImageFile] = useState<File | null>(
    null
  );
  const { activeStep, changeStep } = useStep(2);

  // Disable undo/redo button state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Clear the signature pad
  const clear = () => {
    sigPadRef.current?.clear();
    setSignatureImageBase64(null);
    setSignatureImageFile(null);
    setCanUndo(false);
    setCanRedo(false);
  };

  const handleSaveSignature = () => {
    const trimmedCanvas = sigPadRef.current?.getTrimmedCanvas();
    if (trimmedCanvas) {
      const imageBase64 = trimmedCanvas.toDataURL("image/png");
      

      // Save the base64 string in state
      setSignatureImageBase64(imageBase64);

      // Convert the base64 to a Blob
      const byteString = atob(imageBase64.split(",")[1]); // Decode base64
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      // Create a Blob from the Uint8Array
      const imageBlob = new Blob([uintArray], { type: "image/png" });

      // Create an image file from the Blob
      const imageFile = new File([imageBlob], "signature.png", {
        type: "image/png",
      });
      // 

      // Save the image file in state
      setSignatureImageFile(imageFile);

      // Pass both the base64 string and the file along with the index to the parent
      onCreateSignature(imageBase64, index, imageFile);

      setIsOpen(false);
    }
  };

  // Handle undo action
  const handleUndo = () => {
    if (sigPadRef.current) {
      const data = sigPadRef.current.toData();
      if (data.length > 0) {
        data.pop(); // Remove the last line or dot
        sigPadRef.current.fromData(data); // Set the new data to the pad
        setCanRedo(true); // Enable redo after undo
      }
      setCanUndo(sigPadRef.current?.toData().length > 0 || false);
    }
  };

  // Handle redo action
  const handleRedo = () => {
    // This part can be tricky because `SignaturePad` doesn't provide redo functionality directly.
    // I'd need to save and restore the `redoStack` similarly to the `undo` stack.
    if (sigPadRef.current) {
      // For now, I am going to add the redo functionality by tracking the signature data.
      // This requires a more complex approach that involves storing the undo stack and redo stack separately.

      setCanUndo(true); // improve this by implementing a redo mechanism if needed
    }
  };

  const handleEnd = () => {
    const data = sigPadRef.current?.toData();
    setCanUndo(!!(data && data.length > 0));
    setCanRedo(false);
  };

  const handleUpload = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageBase64 = reader.result as string;
        setSignatureImageBase64(imageBase64);
        setSignatureImageFile(file);
        onCreateSignature(imageBase64, index, file);
        setIsOpen(false);
      };
    }
  };

  // Explicitly type the SignaturePad component to use the extended props
  const TypedSignaturePad =
    (SignaturePad as unknown) as React.ComponentType<ExtendedSignatureCanvasProps>;

  return activeStep === 1 ? (
    <LandlordTenantModalPreset
      style={{ width: "100%", height: "fit" }}
      heading="Draw your signature"
    >
      <div className="flex flex-col justify-between h-full">
        <p className="text-sm font-normal mb-2">
          Use your mouse, trackpad, touchscreen, or pen to sign directly in the
          designated area.
        </p>
        <TypedSignaturePad
          ref={sigPadRef}
          canvasProps={{ className: "w-full h-[38vh] light-shadow" }}
          penColor="blue"
          //onEnd={handleEnd}
        />
        <div className="w-full flex justify-between mt-5">
          <div className="flex gap-2 items-center">
            <button
              onClick={clear}
              className="bg-brand-9 px-3 py-2 text-xs rounded-md text-white"
            >
              Clear
            </button>
            <button onClick={handleUndo} disabled={!canUndo} className="">
              <UndoSigArrow />
            </button>
            <button onClick={handleRedo} disabled={!canRedo} className="">
              <RedoSigArrow />
            </button>
          </div>
          <div className="flex gap-2 self-end">
            <Button
              size="sm"
              variant="border"
              onClick={() => changeStep(2)}
              className="border border-brand-9 px-3 py-2 text-xs rounded-md text-brand-9"
            >
              Upload Signature
            </Button>
            <Button
              onClick={handleSaveSignature}
              size="sm"
              className="bg-brand-9 px-3 py-2 text-xs rounded-md text-white"
            >
              Save Signature
            </Button>
          </div>
        </div>
      </div>
    </LandlordTenantModalPreset>
  ) : (
    <LandlordTenantModalPreset
      style={{ width: "100%", height: "70vh" }}
      heading="Upload Your Signature"
      back={{ handleBack: () => changeStep(1) }}
    >
      <UploadSignature
        type="landlord"
        method="import"
        submitAction={handleUpload}
      />
    </LandlordTenantModalPreset>
  );
};

export default SignatureModal;
