"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const feedbackSchema = z.object({
  type: z.enum(["suggestion", "bug_report"], {
    required_error: "feedbackDialog.typeRequired",
  }),
  subject: z.string().min(1, "feedbackDialog.subjectRequired"),
  description: z.string().min(1, "feedbackDialog.descriptionRequired"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "suggestion",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (values: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      // Aquí podrías integrar una API para enviar el feedback
      console.log("Feedback submitted:", {
        ...values,
        userName: user?.name,
        userEmail: user?.email,
        timestamp: new Date().toISOString(),
      });

      toast.success(t("feedbackDialog.successMessage"));
      form.reset();
      onClose();
    } catch (error) {
      toast.error(t("feedbackDialog.errorMessage"));
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("feedbackDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("feedbackDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("feedbackDialog.typeLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "feedbackDialog.selectTypePlaceholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="suggestion">
                        {t("feedbackDialog.suggestionOption")}
                      </SelectItem>
                      <SelectItem value="bug_report">
                        {t("feedbackDialog.bugReportOption")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("feedbackDialog.subjectLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("feedbackDialog.subjectPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("feedbackDialog.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("feedbackDialog.descriptionPlaceholder")}
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
              <p className="text-sm font-medium">
                {t("feedbackDialog.userInfoLabel")}
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">
                    {t("feedbackDialog.userName")}:
                  </span>{" "}
                  {user?.name || tCommon("anonymous")}
                </p>
                <p>
                  <span className="font-medium">
                    {t("feedbackDialog.userEmail")}:
                  </span>{" "}
                  {user?.email || tCommon("notAvailable")}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("feedbackDialog.submitting")
                  : t("feedbackDialog.submitButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
