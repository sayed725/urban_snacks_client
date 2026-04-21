import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface CouponFormFieldsProps {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
}

export function CouponFormFields({ formData, setFormData }: CouponFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="e.g. SAVE20"
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.discountType}
            onValueChange={(v: any) =>
              setFormData({ ...formData, discountType: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fixed (৳)</SelectItem>
              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            required
            min={0}
            step="0.01"
            value={formData.discountValue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountValue: parseFloat(e.target.value) || 0,
              })
            }
            placeholder={
              formData.discountType === "PERCENTAGE"
                ? "e.g. 10 for 10%"
                : "e.g. 5.00"
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Order Amount</label>
          <Input
             type="number"
             min={0}
             step="0.01"
             value={formData.minOrderAmount === 0 && !formData.minOrderAmount ? "" : formData.minOrderAmount}
             onChange={(e) => {
               const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
               setFormData({
                 ...formData,
                 minOrderAmount: val,
               });
             }}
             placeholder="0 for no minimum"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.discountType === "PERCENTAGE" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Discount Cap (৳)</label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={formData.maxDiscountAmount === 0 && !formData.maxDiscountAmount ? "" : formData.maxDiscountAmount}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                setFormData({
                  ...formData,
                  maxDiscountAmount: val,
                });
              }}
              placeholder="Max discount in Taka"
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Usage Limit</label>
          <Input
            type="number"
            min={0}
            value={formData.usageLimit === 0 && !formData.usageLimit ? "" : formData.usageLimit}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : parseInt(e.target.value);
              setFormData({
                ...formData,
                usageLimit: val,
              });
            }}
             placeholder="0 for unlimited"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Expiry Date <span className="text-red-500">*</span>
        </label>
        <Input
          type="datetime-local"
          required
          value={formData.expiryDate}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description (Optional)</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Internal notes about this coupon..."
          className="resize-none h-20"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Active Status</label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(c) =>
            setFormData({ ...formData, isActive: c })
          }
        />
      </div>
    </>
  );
}
