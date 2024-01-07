"use client"
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import WebPageEditor from "@/app/components/Merchant/webPageEditor";
import WebPageViewer from "@/app/components/Merchant/webPageViewer";
import toast from "react-hot-toast";


export default function WebPage() {
  const [webPage, setWebPage] = useState({});
  const [page, setPage] = useState({});
  const [editing, setEditing] = useState(false);
  const [existPage, setExistPage] = useState(false);

  useEffect(() => {
    const getWebPages = async () => {
      try {
        const response = await fetch("/api/webPage");
        const data = await response.json();
  
        const webPageCookie = Cookies.get("webPage");
        const parsedWebPageData = webPageCookie ? JSON.parse(webPageCookie) : null;
        if (parsedWebPageData) {
          setWebPage(parsedWebPageData);
        }
  
        const foundPage = data.webPage.find((u) => u.id === parsedWebPageData.id);
  
        if (foundPage) {
          setExistPage(true);
          setPage(foundPage);
        } else {
          setExistPage(false);
        }
      } catch (error) {
        console.error("Error al obtener datos de la webPage:", error);
      }
    };
  
    getWebPages();
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async (data) => {
    setEditing(false); // Oculta el editor después de guardar
    setExistPage(true);

    try {
      const response = await fetch("/api/webPage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Error al crear la página web");
        console.error("Error en la función POST. Código de estado:", response.status);
        return;
      }

      console.log("Página web añadida con éxito");
      toast.success("Página web añadida con éxito");
    } catch (error) {
      console.error("Error en la función POST:", error);
      toast.error("Error en el servidor");
    }finally{
      window.location.reload()
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch("/api/webPage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: webPage.id }),
      });

      if (response.ok) {
        console.log("Página web eliminada con éxito");
        setExistPage(false);
      } else {
        console.error("Error al eliminar la página web:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud al servidor:", error);
    }
  };

  const logPageData = () => {
    console.log("Página web Cookies: ", webPage);
    console.log("Página del txt: ", page);
  };

  return (
    <div>
      {editing ? (
        <WebPageEditor onSave={handleSave} onCancel={handleCancel} initialData={webPage} />
      ) : (
        <div>
          {existPage ? (
            <>
              <WebPageViewer webPageData={page} />
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleEditClick}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDeleteClick}
                >
                  Borrar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleEditClick}
            >
              Crear Nueva Página Web
            </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


