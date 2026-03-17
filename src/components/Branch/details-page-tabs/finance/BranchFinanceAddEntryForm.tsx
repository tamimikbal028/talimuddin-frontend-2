import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaPlus, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";
import { branchHooks } from "../../../../hooks/useBranch";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../../../constants";

const entrySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().trim().min(1, "Category is required"),
  note: z.string().trim().optional(),
  date: z.string().min(1, "Date is required"),
  person: z.string().optional(),
  details: z
    .array(
      z.object({
        itemName: z.string().trim().min(1, "Item name is required"),
        amount: z.coerce.number().positive("Amount must be > 0"),
      })
    )
    .optional(),
});

type EntryFormData = z.infer<typeof entrySchema>;

interface BranchFinanceAddEntryFormProps {
  onSuccess: () => void;
}

const BranchFinanceAddEntryForm = ({
  onSuccess,
}: BranchFinanceAddEntryFormProps) => {
  const { mutate: createEntry, isPending: isCreating } =
    branchHooks.useCreateFinanceEntry();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema) as Resolver<EntryFormData>,
    defaultValues: {
      type: "INCOME",
      date: new Date().toISOString().split("T")[0],
      details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const selectedType = watch("type");

  const onSubmit = (data: EntryFormData) => {
    createEntry(
      {
        type: data.type,
        amount: data.amount,
        category: data.category,
        note: data.note,
        date: data.date,
        person: data.person || undefined,
        details:
          data.details && data.details.length > 0 ? data.details : undefined,
      },
      {
        onSuccess: () => {
          reset({
            type: "INCOME",
            date: new Date().toISOString().split("T")[0],
            details: [],
          });
          onSuccess();
        },
      }
    );
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">New Entry</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          {(["INCOME", "EXPENSE"] as const).map((t) => (
            <label
              key={t}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold transition-colors ${
                selectedType === t
                  ? t === "INCOME"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={t}
                {...register("type")}
                className="sr-only"
              />
              {t === "INCOME" ? (
                <FaArrowUp className="h-4 w-4" />
              ) : (
                <FaArrowDown className="h-4 w-4" />
              )}
              {t === "INCOME" ? "Income" : "Expense"}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Amount (BDT) *
            </label>
            <input
              type="number"
              {...register("amount")}
              placeholder="e.g. 500"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Category (খাত) *
            </label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select category --</option>
              {(selectedType === "INCOME"
                ? INCOME_CATEGORIES
                : EXPENSE_CATEGORIES
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Date *
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Username / Phone{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              {...register("person")}
              placeholder="e.g. abdullah_21 or 01712345678"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Details Section */}
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Breakdown Details{" "}
              <span className="text-xs font-normal text-gray-500">
                (Optional)
              </span>
            </h3>
            <button
              type="button"
              onClick={() =>
                append({ itemName: "", amount: "" as unknown as number })
              }
              className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50"
            >
              <FaPlus className="h-3 w-3" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-3 rounded-md bg-white p-3 shadow-sm outline-1 -outline-offset-1 outline-gray-200"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    {...register(`details.${index}.itemName` as const)}
                    placeholder="Item name"
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.details?.[index]?.itemName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.details[index]?.itemName?.message}
                    </p>
                  )}
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    {...register(`details.${index}.amount` as const)}
                    placeholder="Amount"
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.details?.[index]?.amount && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.details[index]?.amount?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-1.5 text-gray-400 hover:text-red-500"
                  title="Remove Item"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-center text-xs text-gray-500">
                No breakdown details added. Click "Add Item" to add specifics.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register("note")}
            placeholder="Add a note..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            <FaPlus className="h-3.5 w-3.5" />
            {isCreating ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BranchFinanceAddEntryForm;
