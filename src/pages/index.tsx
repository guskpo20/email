import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";

import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {


  const [emailElements, setEmailelements] = useState<[{type: string, styles: string, element: any, id: string}] | undefined>(undefined)
  
  const [selectedElement, setSelectedElement] = useState<HTMLElement| undefined>(undefined)
  
  

  useEffect(() => {

    
    
  //@ts-ignore
  const dropzones = [...document.querySelectorAll(".dropzone")];
  //@ts-ignore
  const draggables = [...document.querySelectorAll(".draggable")];

  const createTitulo = (styles: any) => {
    let elementoTitulo = document.createElement("tr")
    elementoTitulo.classList.add("already-dragged")
    elementoTitulo.classList.add("draggable")
    elementoTitulo.setAttribute("draggable", "true")
    elementoTitulo.innerHTML = `<td style="${styles}">
                                  Titulo
                                </td>`
    return elementoTitulo
  }

  const createParrafo = (styles:any) => {
    let elementoParrafo = document.createElement("tr") 
    elementoParrafo.classList.add("already-dragged")
    elementoParrafo.classList.add("draggable")
    elementoParrafo.setAttribute("draggable", "true")
    elementoParrafo.setAttribute("id", "drag-2")
    elementoParrafo.innerHTML = `
    <tr>
      <td style="${styles}">
        Parrafo
      </td>
    </tr>    
    `
    return elementoParrafo
  }

  const agregarItem = (item: any, e: any) => {
    let zone = dropzones[0]
    const afterElement = getDragAfterElement(zone, e.clientY);
    
    let toAppend: any = undefined
    let id = window.crypto.randomUUID()
   
    let nuevoElemento = {
      type:  item.getAttribute("datatype"),
      styles: "",
      element: undefined,
      id: id
    }

    switch (item.getAttribute("datatype")) {
      case "title":
        nuevoElemento.styles = "font-family: Arial; font-size: 24px; font-weight:bold; line-height: 26px; color: black; text-align: left;"
        toAppend = createTitulo(nuevoElemento.styles)
        break;
    
      default:
        nuevoElemento.styles = "font-family: Arial; font-size: 18px; line-height: 20px; text-align: left;"
        toAppend = createParrafo(nuevoElemento.styles)
        break;
    }

    toAppend.setAttribute("id", id)

    nuevoElemento.element = toAppend;
    
    let newArreglo = emailElements
    newArreglo?.push(nuevoElemento)
    setEmailelements(newArreglo)

    if (afterElement === null) {
      zone.appendChild(toAppend);
    } else {
      zone.insertBefore(toAppend, afterElement);
    }
    
    toAppend.addEventListener("click", () => {
      toAppend.setAttribute("contenteditable", "true")
      toAppend.focus()
      toAppend.setAttribute("draggable", "false")

      setSelectedElement(toAppend)

      toAppend.addEventListener("blur", () => {
        toAppend.setAttribute("draggable", "true")
        toAppend.setAttribute("contenteditable", "false")
      })
    })

    toAppend.addEventListener("dragstart", (e: any) => {
      toAppend.classList.add("is-dragging");
    });
    toAppend.addEventListener("dragend", (e: any) => {
      toAppend.classList.remove("is-dragging");
    });
    
}

  function getDragAfterElement(container: any, y:any) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.is-dragging)")
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return {
            offset,
            element: child
          };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e: any) => {
      draggable.classList.add("is-dragging");
    });

    draggable.addEventListener("dragend", (e: any) => {
      const copiaElementoConDescendientes = draggable?.cloneNode(true);
      draggable.classList.remove("is-dragging");
      if(!copiaElementoConDescendientes.classList.contains("is-dragging")){
        copiaElementoConDescendientes.classList.add("already-dragged")
        agregarItem(copiaElementoConDescendientes, e)
      }
    });
  });

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e: any) => {
      e.preventDefault();
      const draggable = document.querySelector(".is-dragging");
      
      if (draggable?.classList.contains("already-dragged")) {
        console.log("algo")
        const afterElement = getDragAfterElement(zone, e.clientY);
  
        if (afterElement === null) {
          zone.appendChild(draggable);
        } else {
          zone.insertBefore(draggable, afterElement);
        }
      }else{
        console.log("nada")
      }
    });
  });

  
  
}, [])

  const elementToShow = (id: any) => {
    
    console.log(emailElements)
    if(emailElements && emailElements?.length > 0){
      return emailElements.find(item => item.id == id)?.styles
    }
    return ""
  }

 

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={`${styles.options}`}>
          <h2>Style Options</h2>
          {selectedElement ? (<p>{elementToShow(selectedElement.getAttribute("id"))}</p>) : ""}
          </div>
        <table className={`${styles.dropzone} dropzone target`} cellPadding={0} cellSpacing={0}>
        </table>
        <div className={`${styles.sideBar} source`}>
          <div className="draggable" id="drag-1" draggable="true" datatype="title">titulo</div>
          <div className="draggable" id="drag-2" draggable="true" datatype="paragraph">parrafo</div>
          <div className="draggable" id="drag-3" draggable="true">drag-3</div>
          <div className="draggable" id="drag-4" draggable="true">drag-4</div>
          <div className="draggable" id="drag-5" draggable="true">drag-5</div>
        </div>
      </main>
    </>
  );
}
