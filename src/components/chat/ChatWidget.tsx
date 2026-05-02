/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Database
} from "lucide-react";
import { toast } from "sonner";
import {
  queryRagAction,
  ingestItemsAction,
  ingestCategoriesAction
} from "@/actions/rag.action";
import { authClient } from "@/lib/auth-client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  matchInfo?: string;   // e.g. "72% matched" from the RAG action
  isError?: boolean;
  queryToRetry?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! I'm your Urban Snacks AI assistant 👋\n\nAsk me anything about our snacks — their ingredients, prices, or recommendations. I'll find the best match for you.",
  },
];

const SUGGESTED_QUERIES = [
  "Spicy snacks",
  "Best Selling Snacks",
  "Beef Items",
];

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0 shadow-md">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onRetry,
}: {
  message: Message;
  onRetry?: (query: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
          isUser
            ? "bg-gradient-to-br from-slate-600 to-slate-800"
            : "bg-gradient-to-br from-orange-500 to-red-600"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      <div
        className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl rounded-br-sm shadow-md"
              : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          {typeof message.content === "string"
            ? message.content
                .split(/(\*\*.*?\*\*)/g)
                .map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  ),
                )
            : JSON.stringify(message.content, null, 2)}
        </div>

        {/* Error Retry Button */}
        {message.isError && onRetry && message.queryToRetry && (
          <button
            onClick={() => onRetry(message.queryToRetry!)}
            className="flex items-center gap-1 text-[10px] text-orange-600 hover:text-orange-700 font-medium mt-1 cursor-pointer bg-orange-50 px-2 py-1 rounded-md border border-orange-100"
          >
            <RefreshCw size={10} />
            Retry
          </button>
        )}

        {/* Match info badge */}
        {!isUser && message.matchInfo && (
          <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
            <Sparkles size={8} />
            {message.matchInfo}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, startQueryTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user?.role === "admin") {
        setIsAdmin(true);
      }
    });
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Sync handlers ────────────────────────────────────────────────────────
  const handleSyncItems = () => {
    startSyncTransition(async () => {
      const result = await ingestItemsAction();
      if (result.success) {
        toast.success(`Items synced successfully!`, {
          description: result.message,
        });
      } else {
        toast.error("Sync failed", { description: result.error });
      }
    });
  };

  const handleSyncCategories = () => {
    startSyncTransition(async () => {
      const result = await ingestCategoriesAction();
      if (result.success) {
        toast.success(`Categories synced successfully!`, {
          description: result.message,
        });
      } else {
        toast.error("Sync failed", { description: result.error });
      }
    });
  };

  // ── Send message handler ─────────────────────────────────────────────────
  const handleSend = (query?: string) => {
    const text = (query ?? inputValue).trim();
    if (!text || isQuerying) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    startQueryTransition(async () => {
      const result = await queryRagAction(text);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: result.success
          ? result.answer!
          : (result.error ?? "Something went wrong. Please try again."),
        matchInfo: result.success && typeof result.sources === "string"
          ? result.sources
          : undefined,
        isError: !result.success,
        queryToRetry: !result.success ? text : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    });
  };

  return (
    <>
      {/* ── Chat Window ────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-[140px] sm:bottom-[160px] right-5 z-50 w-[calc(100vw-40px)] sm:w-[380px] lg:w-[416px] flex flex-col rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 180px)" }}
        inert={!isOpen ? true : undefined}
      
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">
               Urban Snacks AI
              </p>
              <p className="text-orange-100 text-[10px] mt-0.5">
                Powered by RAG · Always online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Sync buttons — ADMIN ONLY */}
            {isAdmin && (
              <>
                <button
                  onClick={handleSyncItems}
                  disabled={isSyncing}
                  title="Sync Items"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Database
                    size={14}
                    className={isSyncing ? "animate-pulse" : ""}
                  />
                </button>
                <button
                  onClick={handleSyncCategories}
                  disabled={isSyncing}
                  title="Sync Categories"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw
                    size={14}
                    className={isSyncing ? "animate-spin" : ""}
                  />
                </button>
              </>
            )}
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 min-h-0"
          style={{ minHeight: "200px", maxHeight: "55vh" }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
          ))}

          {isQuerying && <TypingIndicator />}


        </div>

        {/* Input area */}
        <div className="shrink-0 px-3 py-3 bg-white border-t border-slate-100 flex flex-col gap-2.5">
          {/* Suggested queries (Always visible as horizontal chips) */}
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isQuerying}
                className="shrink-0 whitespace-nowrap text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about snacks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isQuerying}
              className="flex-1 text-sm bg-slate-100 border border-transparent focus:border-orange-300 focus:bg-white rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isQuerying || !inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Floating Trigger Button ────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className={`fixed bottom-24 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageSquare size={24} className="relative z-10" />}
        
        {/* Pulsing ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-orange-500 opacity-30 animate-ping" />
        )}

        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border dark:border-slate-800">
            Ask Urban AI
          </span>
        )}
      </button>
    </>
  );
}
