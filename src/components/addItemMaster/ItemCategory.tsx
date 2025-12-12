import { useState } from "react";
import { X, Save, Trash2, Loader2 } from "lucide-react";
import { createItemCategory } from "./api/categoryservice";
interface ItemCategoryProps {
  onClose: () => void;
}

const ItemCategory: React.FC<ItemCategoryProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "0010",
    name: "",
    image: null as string | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => setFormData({ ...formData, image: null });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        image: formData.image,
      };

      const response = await createItemCategory(payload);

      if (response.success) {
        console.log("Category created successfully:", response);
        onClose();
      } else {
        alert(response.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("An error occurred while saving the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ code: "0010", name: "", image: null });
  };

  return (
    <div className="w-[450px] bg-white border border-gray-300 shadow-lg font-sans text-sm">
      <div className="bg-[#104a8e] text-white px-4 py-2 flex justify-between items-center select-none">
        <h3 className="font-semibold text-base">Item Category</h3>
        <button
          onClick={onClose}
          disabled={loading}
          className="hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium shrink-0">
            Code
          </label>
          <input
            type="text"
            value={formData.code}
            readOnly
            className="w-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 bg-gray-50 text-gray-600"
          />
        </div>

        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium shrink-0">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            className="w-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex items-start mt-1">
          <label className="w-24 text-gray-700 font-medium shrink-0 pt-1">
            Image
          </label>
          <div className="flex flex-col gap-2">
            <div className="relative w-40 h-44 bg-gray-200 border-2 border-dashed border-gray-500 flex items-center justify-center">
              {formData.image && (
                <>
                  <img
                    src={formData.image}
                    alt="Category"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-[#104a8e] text-white p-1 shadow-sm hover:bg-blue-800 disabled:opacity-50"
                  >
                    <X size={12} />
                  </button>
                </>
              )}

              {!formData.image && (
                <div className="relative w-24 h-24 bg-[#3b82f6] rounded-full overflow-hidden border-4 border-white shadow-sm flex items-end justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-[-10px]"></div>
                </div>
              )}
            </div>

            <label
              className={`bg-[#104a8e] text-white px-4 py-1.5 text-xs font-medium self-start transition-colors cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
              }`}
            >
              Browse
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#104a8e] p-2 flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 border border-white text-white hover:bg-white/10 transition-colors rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>{loading ? "Saving..." : "Save"}</span>
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 border border-white text-white hover:bg-white/10 transition-colors rounded-[2px] disabled:opacity-50"
        >
          <Trash2 size={14} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default ItemCategory;
