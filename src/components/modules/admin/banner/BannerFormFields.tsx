import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dispatch, SetStateAction } from "react";
import { ImageUploadField } from "@/components/shared/form/image-upload-field";
import { Textarea } from "@/components/ui/textarea";

interface BannerFormFieldsProps {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
}

export function BannerFormFields({ formData, setFormData }: BannerFormFieldsProps) {
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Title (Optional)</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Special Offer"
        />
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
          <label className="text-sm font-medium">Badge (Optional)</label>
          <Input
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="e.g. NEW"
          />
        </div>
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
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Is Hero Banner?</label>
          <p className="text-xs text-muted-foreground">Main slider banner if checked</p>
        </div>
        <Switch
          checked={formData.banner}
          onCheckedChange={(c) => setFormData({ ...formData, banner: c })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Active Status</label>
          <p className="text-xs text-muted-foreground">Visible to users if checked</p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
        />
      </div>
    </>
  );
}
