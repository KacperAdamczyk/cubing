import { MultiLayer } from "@/components/MultiLayer";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { useAsyncList } from "@react-stately/data";
import { useCallback, type FC } from "react";
import type { InferEntrySchema } from "astro:content";

export interface Case extends InferEntrySchema<"cases"> {
  subset: InferEntrySchema<"subsets"> & {
    set: InferEntrySchema<"sets">;
  };
  mainAlgorithm: InferEntrySchema<"algorithms"> | null;
}

interface Props {
  cases: Case[];
}

export const SummaryTable: FC<Props> = ({ cases }) => {
  const list = useAsyncList({
    load: () => {
      const items = cases.map(
        ({
          id,
          name,
          mainAlgorithm,
          setup,
          viewType,
          subset: {
            id: subsetId,
            name: subsetName,
            set: { id: setId, name: setName },
          },
        }) => {
          return {
            id,
            name,
            setup,
            viewType,
            mainAlgorithm: mainAlgorithm?.rotations ?? "-",
            subsetId,
            subsetName,
            setId,
            setName,
          };
        },
      );

      return { items };
    },
    getKey: (item) => item.id,
    sort({ items, sortDescriptor }) {
      return {
        items: items.toSorted((a, b) => {
          const first =
            sortDescriptor.column && a[sortDescriptor.column as keyof typeof a];
          const second =
            sortDescriptor.column && b[sortDescriptor.column as keyof typeof b];

          if (!first || !second || first === second) {
            return 0;
          }

          let comparator = first > second ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            comparator *= -1;
          }

          return comparator;
        }),
      };
    },
  });

  const renderCell = useCallback(
    (row: (typeof list.items)[number], columnKey: string | number) => {
      switch (columnKey) {
        case "preview":
          return (
            <div className="w-20">
              <MultiLayer algorithm={row.setup} type={row.viewType} />
            </div>
          );
        case "name":
          return (
            <Link href={`/cases/${row.id}`}>
              <Chip color="primary">{row.name}</Chip>
            </Link>
          );
        case "subsetName":
          return (
            <Link href={`/${row.setId}/${row.subsetId}#${row.id}`}>
              <Chip color="success">{row.subsetName}</Chip>
            </Link>
          );
        case "setName":
          return (
            <Link href={`/${row.setId}#${row.id}`}>
              <Chip color="secondary">{row.setName}</Chip>
            </Link>
          );
        default:
          return getKeyValue(row, columnKey) as string | null;
      }
    },
    [list],
  );

  return (
    <Table
      aria-label="Example table with client side sorting"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <TableHeader>
        <TableColumn key="preview">Preview</TableColumn>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="mainAlgorithm">Main Algorithm</TableColumn>
        <TableColumn key="subsetName" allowsSorting>
          Subset
        </TableColumn>
        <TableColumn key="setName" allowsSorting>
          Set
        </TableColumn>
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
