import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
// import data from "../MOCK_DATA.json";
import { useState, useEffect } from "react";
import axios from "axios";

export function SimpleTable() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/info/")
      .then((response) => {
        setData(response.data.tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const columns = [
    { Header: "ID", accessorKey: "id" },
    { Header: "Modelo", accessorKey: "modelo" },
    { Header: "Directorio", accessorKey: "directorio" },
    { Header: "Clave", accessorKey: "clave" },
    { Header: "Protocolo", accessorKey: "protocolo" },
    { Header: "Marca", accessorKey: "marca" },
    { Header: "IP", accessorKey: "ip" },
    { Header: "Usuario", accessorKey: "usuario" },
    { Header: "Serial", accessorKey: "serial" },
    {
      header: "actions",
      cell: () => (
        <div>
          <button onClick={() => console.log("first")}>Editar</button>
          <button onClick={() => console.log("eStoy funcionando")}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "left" }}>
        <input
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          type="text"
        />
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  onClick={header.column.getToggleSortingHandler()}
                  key={header.id}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {
                    { asc: "⬆️", desc: "⬇️" }[
                      header.column.getIsSorted() ?? null
                    ]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel()?.rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => table.setPageIndex(0)}>Primera Pagina</button>
      <button onClick={() => table.nextPage()}>Siguiente</button>
      <button onClick={() => table.previousPage()}>Anterior</button>
      <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
        Ultima Pagina
      </button>
    </div>
  );
}
