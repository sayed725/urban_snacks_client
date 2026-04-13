import { ImageUploadField } from '@/components/shared/form/image-upload-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const AddItemForm = ({ formData, setFormData, categories, onSubmit, isPending, buttonText, onCancel }: any) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
    <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
            <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Price ($) <span className="text-red-500">*</span></label>
            <Input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Weight <span className="text-red-500">*</span></label>
            <Input required placeholder="e.g. 500g" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
        </div>
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
                placeholder="Delicious snack description..." 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
            />
        </div>
        <div className="space-y-2 col-span-2">

            <ImageUploadField
                field={{
                    name: "image",
                    state: { value: formData.image, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, image: val })
                } as any}
                label="Product Image"
            />
        </div>
    </div>

    <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="flex items-center space-x-2">
            <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
            <label className="text-sm">Active</label>
        </div>
        <div className="flex items-center space-x-2">
            <Switch checked={formData.isFeatured} onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })} />
            <label className="text-sm">Featured</label>
        </div>
        <div className="flex items-center space-x-2">
            <Switch checked={formData.isSpicy} onCheckedChange={(c) => setFormData({ ...formData, isSpicy: c })} />
            <label className="text-sm text-red-500 font-bold">Spicy 🌶️</label>
        </div>
    </div>

    <div className="pt-4 flex justify-end gap-2 border-t mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : buttonText}
        </Button>
    </div>
  </form>
  )
}

export default AddItemForm