import { pushModal, popModal } from "jenesius-vue-modal";
import { toast } from "vuetify-sonner";
import errorDialog from "~/components/dialog/error.vue";
import confirmDialog from "~/components/dialog/confirm.vue";

type errorProps = {
  title: string;
  details: string;
  confirmText?: string;
  onConfirm?: Function;
};
type confirmProps = {
  title: string;
  details: string;
  confirmText?: string;
  onConfirm?: Function;
  cancelText?: string;
  onCancel?: Function;
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dialog: {
        error: {
          open: (options: errorProps) =>
            pushModal(
              errorDialog,
              {
                title: options.title,
                details: options.details,
                confirmText: options.confirmText || "ตกลง",
                onConfirm: options.onConfirm || popModal,
              },
              { backgroundClose: false },
            ),
          close: () => popModal(),
        },
        confirm: {
          open: (options: confirmProps) =>
            pushModal(
              confirmDialog,
              {
                title: options.title,
                details: options.details,
                confirmText: options.confirmText || "ตกลง",
                onConfirm: options.onConfirm || popModal,
                cancelText: options.cancelText || "ยกเลิก",
                onCancel: options.onCancel || popModal,
              },
              { backgroundClose: false },
            ),
        },
        toast: {
          success: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-check-circle",
              cardProps: {
                color: "success",
                class: "my-toast",
              },
            });
          },
          error: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-close-circle",
              cardProps: {
                color: "error",
                class: "my-toast",
              },
            });
          },
          warning: (text: string) => {
            toast(text, {
              duration: 2000,
              prependIcon: "mdi-alert",
              cardProps: {
                color: "warning",
                class: "my-toast",
              },
            });
          },
          message: (text: string) => {
            toast(text, {
              duration: 2000,
            });
          },
        },
      },
    },
  };
});
