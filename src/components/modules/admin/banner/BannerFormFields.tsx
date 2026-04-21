import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dispatch, SetStateAction } from "react";
import { ImageUploadField } from "@/components/shared/form/image-upload-field";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BannerFormFieldsProps {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
}

export function BannerFormFields({ formData, setFormData }: BannerFormFieldsProps) {
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ isActive: true, limit: 100 }),
  });

  const categories = categoriesResponse?.data || [];

  return (
    <>
      <div className="space-y-2">
        <ImageUploadField
          field={{
            name: "image",
            state: { value: formData.image, meta: { isTouched: false, errors: [] } },
            handleChange: (val: string) => setFormData({ ...formData, image: val })
          } as any}
          label="Banner Image"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title (Optional)</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Special Offer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Badge (Optional)</label>
          <Input
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="e.g. NEW"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subtitle / Description (Optional)</label>
        <Textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="e.g. Get 20% off on all items"
          className="resize-none h-20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Button Text (Optional)</label>
          <Input
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            placeholder="e.g. Shop Now"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Link to Category (Optional)</label>
          <Select
            value={formData.categoryId || "none"}
            onValueChange={(val) => setFormData({ ...formData, categoryId: val === "none" ? "" : val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category (Link to All)</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Order</label>
          <Input
            type="number"
            min={0}
            value={formData.order === 0 && !formData.order ? "" : formData.order}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : parseInt(e.target.value);
              setFormData({ ...formData, order: val });
            }}
            placeholder="e.g. 1"
          />
        </div>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Is Hero Banner?</label>
            </div>
            <Switch
              checked={formData.banner}
              onCheckedChange={(c) => setFormData({ ...formData, banner: c })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Active Status</label>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
