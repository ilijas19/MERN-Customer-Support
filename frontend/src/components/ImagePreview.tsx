import { IoMdClose } from "react-icons/io";

type PreviewProps = {
  onClose: () => void;
  selectedImgUrl: string;
};
const ImagePreview = ({ onClose, selectedImgUrl }: PreviewProps) => {
  return (
    <div className="relative">
      <IoMdClose
        onClick={onClose}
        className="text-red-600 absolute right-0 cursor-pointer"
        size={30}
      />
      <img
        src={selectedImgUrl}
        className=" w-full max-h-[600px] object-contain"
      />
    </div>
  );
};
export default ImagePreview;
