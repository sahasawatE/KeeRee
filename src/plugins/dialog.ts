import { pushModal, popModal } from "jenesius-vue-modal";
import { toast } from "vuetify-sonner";
import errorDialog from "~/components/dialog/error.vue";

type errorProps = {
  title: string;
  details: string;
  confirmText?: string;
  onConfirm?: Function;
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
