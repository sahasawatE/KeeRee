export default defineNuxtPlugin(() => {
  function createHeader() {
    console.log("hokhok");
  }

  return {
    provide: {
      csv: {
        export: () => {
          createHeader();

          return "hok";
        },
      },
    },
  };
});
