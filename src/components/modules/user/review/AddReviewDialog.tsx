"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createReview, updateReview } from "../../../../features/review/services/review.service";
import { IOrder } from "../../../../features/order/order.type";
import { IReview } from "../../../../features/review/review.type";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(1, "Comment is required"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewDialogProps {
    order: IOrder;
    initialReview?: IReview;
    trigger?: React.ReactNode;
}

export default function AddReviewDialog({ order, initialReview, trigger }: AddReviewDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const isEditMode = !!initialReview;

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: initialReview?.rating || 5,
            comment: initialReview?.comment || "",
        },
    });

    // Reset form when initialReview changes or dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            form.reset({
                rating: initialReview?.rating || 5,
                comment: initialReview?.comment || "",
            });
        }
    }, [initialReview, isDialogOpen, form]);

    const mutation = useMutation({
        mutationFn: isEditMode && initialReview
            ? (values: ReviewFormValues) => updateReview(initialReview.id, values)
            : createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            toast.success(isEditMode ? "Review updated successfully!" : "Review submitted successfully!");
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error.message || `Failed to ${isEditMode ? "update" : "submit"} review`);
        },
    });

    const onSubmit = (values: ReviewFormValues) => {
        if (isEditMode && initialReview) {
            mutation.mutate(values as any); // The mutationFn handles the ID
        } else {
            mutation.mutate({
                orderId: order.id,
                rating: values.rating,
                comment: values.comment,
            } as any);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
                form.reset();
            }
        }}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">{isEditMode ? "Edit Review" : "Add Review"}</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">
                        {isEditMode ? "Edit Your Review" : "Review Your Order"}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {isEditMode ? "Edit your review" : "Review your order"}
                </DialogDescription>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="bg-muted/50 p-4 rounded-2xl border border-dashed text-center">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order No.</p>
                            <p className="text-xl font-black text-primary">{order.orderNumber}</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-bold">Overall Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => field.onChange(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "w-12 h-12 transition-colors",
                                                            field.value >= star
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-muted-foreground"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-bold">Your Experience</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What did you think of your order? Any feedback helps!"
                                            className="min-h-[120px] rounded-2xl resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 rounded-full font-bold h-12"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-full bg-primary text-secondary font-bold h-12"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending
                                    ? isEditMode ? "Updating..." : "Submitting..."
                                    : isEditMode ? "Update Review" : "Post Review"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
