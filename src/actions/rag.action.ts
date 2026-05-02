"use server";

import { fetchApi } from "@/lib/fetch-api";

export const queryRagAction = async (query: string) => {
  try {
    const response = await fetchApi<any>("/api/v1/rag/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    if (!response?.data?.answer) {
      return {
        success: false,
        error: "No answer received from AI. Please try again",
      };
    }

    let answer = response.data.answer;

    if (typeof answer === "object" && answer !== null) {
      if ("items" in answer && Array.isArray(answer.items)) {
        const items = answer.items.slice(0, 5);
        if (items.length > 0) {
          answer =
            `I found ${items.length} snacks that might interest you:\n\n` +
            items
              .map((item: any, i: number) => {
                let text = "";
                if (item.name) text += `${i + 1}. **${item.name}**\n`;
                if (item.price) text += `Price: **$${item.price}**\n`;
                if (item.description) text += `Details: ${item.description}\n`;
                return text + "\n";
              })
              .join("");
        } else {
          answer = "I couldn't find any snacks matching your query. Please try another query.";
        }
      } else {
        answer = answer.answer || answer.message || JSON.stringify(answer, null, 2);
      }
    }

    const similarity = response?.data?.sources?.[0]?.similarity;
    const matchPercentage = similarity ? (100 - Number(similarity) * 100).toFixed(2) : "High";

    return {
      success: true,
      answer: answer as string,
      sources: `${matchPercentage}% matched`,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Failed to reach the AI Assistant. Please check your connection and try again.",
    };
  }
};

export const ingestItemsAction = async () => {
  try {
    const response = await fetchApi<any>("/api/v1/rag/ingest-items", {
      method: "POST",
    });

    return {
      success: true,
      message: response.message || "Items synced successfully.",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Failed to sync items data. Please try again.",
    };
  }
};

export const ingestCategoriesAction = async () => {
  try {
    const response = await fetchApi<any>("/api/v1/rag/ingest-categories", {
      method: "POST",
    });

    return {
      success: true,
      message: response.message || "Categories synced successfully.",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message || "Failed to sync categories data. Please try again.",
    };
  }
};
