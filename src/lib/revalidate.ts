export const triggerOnDemandRevalidation = async (options: {
  tag?: string;
  tags?: string[];
  path?: string;
  paths?: string[];
}) => {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
  } catch (error) {
    console.error("On-demand revalidation trigger failed:", error);
  }
};
