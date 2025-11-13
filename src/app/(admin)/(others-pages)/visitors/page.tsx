"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import ConfirmModal from "@/components/atoms/ConfirmModal";
import { fetchWithAuth } from "@/utils/api";

interface VisitorFormData {
  id: number;
  name: string;
  company: string;
  purpose: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorFormData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/visitors");
      setVisitors(res);
    } catch {
      // console.error(err);
      setError("Gagal memuat data visitor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      await fetchWithAuth("/api/visitors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId }),
      });
      setShowModal(false);
      fetchVisitors();
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manajemen Visitor</h1>
      <Button
        color="blue"
        className="mb-4"
        onClick={() => (window.location.href = "/visitors/form")}
      >
        + Tambah Visitor
      </Button>

      {/* 🔄 Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10 text-gray-500">
          Memuat data...
        </div>
      )}

      {/* ⚠️ Error State */}
      {!loading && error && (
        <div className="text-center text-red-500 py-6">{error}</div>
      )}

      {/* 📭 Empty State */}
      {!loading && !error && visitors.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          Belum ada data visitor. Klik tombol <b>Tambah Visitor</b> untuk menambahkan data baru.
        </div>
      )}

      {/* 📋 Data Table */}
      {!loading && !error && visitors.length > 0 && (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Perusahaan</th>
              <th className="border p-2">Keperluan</th>
              <th className="border p-2 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v.id}>
                <td className="border p-2">{v.name}</td>
                <td className="border p-2">{v.company}</td>
                <td className="border p-2">{v.purpose}</td>
                <td className="border p-2 flex gap-2">
                  <Button
                    color="blue"
                    className="text-xs"
                    onClick={() =>
                      (window.location.href = `/visitors/form?id=${v.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    className="text-xs"
                    onClick={() => handleDelete(v.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal
        open={showModal}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus data ini?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
