import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/Products';
import {
  Tag,
  DollarSign,
  Package,
  ImageIcon,
  Check,
  X,
  FileText,
  Percent,
  Layers,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { MdCancel } from 'react-icons/md';

interface Props {
  editData: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setEditData: React.Dispatch<
    React.SetStateAction<Partial<Product> & { imageFile?: File; imagePreview?: string }>
  >;
  onEditImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveEdit: () => void;
  cancelEditing: () => void;
}

export default function EditProductRow({
  editData,
  setEditData,
  onEditImageChange,
  saveEdit,
  cancelEditing,
}: Props) {
  return (
    <>
      <TableRow className="hidden bg-gray-50 transition-colors hover:bg-gray-100 md:table-row">
        <TableCell>
          <Input
            placeholder="اسم المنتج"
            value={editData.name || ''}
            onChange={e => setEditData({ ...editData, name: e.target.value })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            type="number"
            min={0}
            placeholder="السعر"
            value={editData.price || 0}
            onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            type="number"
            min={0}
            placeholder="الكمية"
            value={editData.quantity || 0}
            onChange={e => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            placeholder="الوصف"
            value={editData.description || ''}
            onChange={e => setEditData({ ...editData, description: e.target.value })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            type="number"
            min={0}
            placeholder="الخصم %"
            value={editData.discount || 0}
            onChange={e => setEditData({ ...editData, discount: parseInt(e.target.value) || 0 })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            placeholder="التصنيف"
            value={editData.category || ''}
            onChange={e => setEditData({ ...editData, category: e.target.value })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            placeholder="نوع الشحن"
            value={editData.shippingType || ''}
            onChange={e => setEditData({ ...editData, shippingType: e.target.value })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <Input
            placeholder="سياسة الإرجاع"
            value={editData.hasReturnPolicy || ''}
            onChange={e => setEditData({ ...editData, hasReturnPolicy: e.target.value })}
            className="text-sm"
          />
        </TableCell>

        <TableCell>
          <label
            htmlFor="edit-image-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 p-2 text-center text-xs text-gray-500 transition hover:border-gray-400 hover:bg-gray-50"
            title="رفع صورة جديدة"
          >
            {!editData.imagePreview ? (
              <span>انقر لرفع صورة</span>
            ) : (
              <img
                src={editData.imagePreview}
                alt="معاينة الصورة"
                className="max-h-20 w-auto rounded object-contain"
              />
            )}
            <input
              id="edit-image-upload"
              type="file"
              accept="image/*"
              onChange={onEditImageChange}
              className="hidden"
            />
          </label>
        </TableCell>

        <TableCell className="flex items-center justify-center gap-2 whitespace-nowrap rtl:space-x-reverse">
          <Button size="sm" variant="outline" onClick={saveEdit} title="حفظ">
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button size="sm" variant="destructive" onClick={cancelEditing} title="إلغاء">
            <X className="h-4 w-4 text-white" />
          </Button>
        </TableCell>
      </TableRow>

      {/* Mobile Table */}
      <div className="z-50 block space-y-4 overflow-y-auto rounded border bg-gray-50 p-4 shadow-sm md:hidden">
        <div className="flex justify-between">
          <label> تعديل : {editData.name}</label>
          <button onClick={() => cancelEditing()}>
            <MdCancel className="text-2xl text-red-500" />
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Tag className="h-4 w-4 text-gray-500" />
          اسم المنتج
        </label>
        <Input
          placeholder="اسم المنتج"
          value={editData.name || ''}
          onChange={e => setEditData({ ...editData, name: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <DollarSign className="h-4 w-4 text-gray-500" />
          السعر
        </label>
        <Input
          type="number"
          placeholder="السعر"
          value={editData.price || 0}
          onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Package className="h-4 w-4 text-gray-500" />
          الكمية
        </label>
        <Input
          type="number"
          placeholder="الكمية"
          value={editData.quantity || 0}
          onChange={e => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileText className="h-4 w-4 text-gray-500" />
          الوصف
        </label>
        <Input
          placeholder="الوصف"
          value={editData.description || ''}
          onChange={e => setEditData({ ...editData, description: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Percent className="h-4 w-4 text-gray-500" />
          الخصم %
        </label>
        <Input
          type="number"
          placeholder="الخصم"
          value={editData.discount || 0}
          onChange={e => setEditData({ ...editData, discount: parseInt(e.target.value) || 0 })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Layers className="h-4 w-4 text-gray-500" />
          التصنيف
        </label>
        <Input
          placeholder="التصنيف"
          value={editData.category || ''}
          onChange={e => setEditData({ ...editData, category: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Truck className="h-4 w-4 text-gray-500" />
          نوع الشحن
        </label>
        <Input
          placeholder="نوع الشحن"
          value={editData.shippingType || ''}
          onChange={e => setEditData({ ...editData, shippingType: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <RotateCcw className="h-4 w-4 text-gray-500" />
          سياسة الإرجاع
        </label>
        <Input
          placeholder="سياسة الإرجاع"
          value={editData.hasReturnPolicy || ''}
          onChange={e => setEditData({ ...editData, hasReturnPolicy: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          صورة المنتج
        </label>
        <label
          htmlFor="edit-image-upload-mobile"
          className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 p-2 text-center text-xs text-gray-500 transition hover:border-gray-400 hover:bg-gray-100"
        >
          {!editData.imagePreview ? (
            <span>انقر لرفع صورة</span>
          ) : (
            <img
              src={editData.imagePreview}
              alt="معاينة الصورة"
              className="max-h-32 w-auto rounded object-contain"
            />
          )}
          <input
            id="edit-image-upload-mobile"
            type="file"
            accept="image/*"
            onChange={onEditImageChange}
            className="hidden"
          />
        </label>

        <div className="flex items-center justify-between gap-2">
          <Button className="flex-1" variant="outline" onClick={saveEdit}>
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button className="flex-1" variant="destructive" onClick={cancelEditing}>
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </>
  );
}
