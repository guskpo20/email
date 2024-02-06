import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";

import { useEffect, useState } from "react";
import { wrap } from "module";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [emailElements, setEmailelements] = useState<
    [{ type: string; styles: string; element: any; id: string }] | any
  >([]);

  const [selectedElement, setSelectedElement] = useState<
    HTMLElement | undefined
  >(undefined);

  useEffect(()=>{
    console.log("updated::")
    console.log(emailElements)
  },[emailElements])


  useEffect(() => {
    //@ts-ignore
    const dropzones = [...document.querySelectorAll(".dropzone")];
    //@ts-ignore
    const draggables = [...document.querySelectorAll(".draggable")];

    const createTitulo = (styles: any) => {
      let elementoTitulo = document.createElement("tr");
      elementoTitulo.classList.add("already-dragged");
      elementoTitulo.classList.add("draggable");
      elementoTitulo.setAttribute("draggable", "true");
      elementoTitulo.innerHTML = `<td style="${styles}">
                                  Titulo
                                </td>`;
      return elementoTitulo;
    };

    const createParrafo = (styles: any) => {
      let elementoParrafo = document.createElement("tr");
      elementoParrafo.classList.add("already-dragged");
      elementoParrafo.classList.add("draggable");
      elementoParrafo.setAttribute("draggable", "true");
      elementoParrafo.setAttribute("id", "drag-2");
      elementoParrafo.innerHTML = `
    <tr>
      <td style="${styles}">
        Parrafo
      </td>
    </tr>    
    `;
      return elementoParrafo;
    };

    const agregarItem = (item: any, e: any) => {
      let zone = dropzones[0];
      const afterElement = getDragAfterElement(zone, e.clientY);

      let toAppend: any = undefined;
      let id = window.crypto.randomUUID();

      let nuevoElemento = {
        type: item.getAttribute("datatype"),
        styles: "",
        element: undefined,
        id: id,
      };

      switch (item.getAttribute("datatype")) {
        case "title":
          nuevoElemento.styles =
            "font-family: Arial; font-size: 24px; font-weight:bold; line-height: 26px; color: black; text-align: left;";
          toAppend = createTitulo(nuevoElemento.styles);
          break;

        default:
          nuevoElemento.styles =
            "font-family: Arial; font-size: 18px; line-height: 20px; text-align: left;";
          toAppend = createParrafo(nuevoElemento.styles);
          break;
      }

      toAppend.setAttribute("id", id);

      nuevoElemento.element = toAppend;

      setEmailelements((prev: any) => [...prev, nuevoElemento]);

      if (afterElement === null) {
        zone.appendChild(toAppend);
      } else {
        zone.insertBefore(toAppend, afterElement);
      }

      toAppend.addEventListener("click", () => {
        toAppend.setAttribute("contenteditable", "true");
        toAppend.focus();
        toAppend.setAttribute("draggable", "false");

        setSelectedElement(toAppend);

        toAppend.addEventListener("blur", () => {
          toAppend.setAttribute("draggable", "true");
          toAppend.setAttribute("contenteditable", "false");
        });
      });

      toAppend.addEventListener("dragstart", (e: any) => {
        toAppend.classList.add("is-dragging");
      });
      toAppend.addEventListener("dragend", (e: any) => {
        toAppend.classList.remove("is-dragging");
      });
    };

    function getDragAfterElement(container: any, y: any) {
      const draggableElements = [
        ...container.querySelectorAll(".draggable:not(.is-dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return {
              offset,
              element: child,
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
        if (!copiaElementoConDescendientes.classList.contains("is-dragging")) {
          copiaElementoConDescendientes.classList.add("already-dragged");
          agregarItem(copiaElementoConDescendientes, e);
        }
      });
    });

    dropzones.forEach((zone) => {
      zone.addEventListener("dragover", (e: any) => {
        e.preventDefault();
        const draggable = document.querySelector(".is-dragging");

        if (draggable?.classList.contains("already-dragged")) {
          const afterElement = getDragAfterElement(zone, e.clientY);

          if (afterElement === null) {
            zone.appendChild(draggable);
          } else {
            zone.insertBefore(draggable, afterElement);
          }
        } else {
        }
      });
    });
  }, []);

  const getObjElements = (finalObj: any) => {
    let final = "";
    for (const key in finalObj) {
      if (finalObj.hasOwnProperty(key)) {
        const value = finalObj[key];
        final += `<span>${key}:</span> <span contenteditable>${value}</span> <br >`;
      }
    }
    return final;
  };

  const elementToShow = (id: any) => {
    if (emailElements && emailElements?.length > 0) {
      const styles = emailElements.find((item: any) => item.id == id)?.styles;
      const props = styles.split(";");

      let finalObj = {};
      props.forEach((el: string) => {
        const propValues = el.trimStart().split(":");
        const a = propValues[0];
        const b = propValues[1];
        if (a && b) {
          finalObj = { ...finalObj, [a]: b.trim() };
        }
      });
      addEditableListeners();
      return getObjElements(finalObj);
    } else {
      return "h";
    }
  };

  const addEditableListeners = () => {
    const wrapper = document.querySelector(`.${styles.options}`);
    setTimeout(() => {
      const allElements = wrapper?.querySelectorAll("[contenteditable]");
      allElements?.forEach((el: any) => {
        el.addEventListener("blur", () => {
          const id = selectedElement?.id;

          const emlItem = emailElements.find((item: any) => item.id == id);

          if(el.parentNode ){

            const updatedStyle = el.parentNode.innerText.replace(/\n\s*/g, "; ");
            document.getElementById(id!)?.querySelector("td")?.setAttribute("style",updatedStyle)
          if(updatedStyle){
            
            const updatedItem = {
              ...emlItem,
              styles: updatedStyle,
            };
            const itemIndex = emailElements.findIndex(
              (item: any) => item.id === id
              );
              
              const updatedElements = [...emailElements];
              updatedElements[itemIndex] = updatedItem;
              setEmailelements(updatedElements);
              console.log(updatedElements)
              
            }
          }
        });
      });
    }, 600);
  };
  const copyCode = ()=>{
    const emlBody = document.querySelector("#emailbody")
    console.log(emlBody?.outerHTML)
    navigator.clipboard.writeText(emlBody?.outerHTML as unknown as string);
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
          {selectedElement ? (
            <p
              dangerouslySetInnerHTML={{
                __html: elementToShow(selectedElement.getAttribute("id")),
              }}
            ></p>
          ) : (
            ""
          )}
        </div>

        <table
          className={`${styles.dropzone} dropzone target`}
          cellPadding={0}
          cellSpacing={0}
          id="emailbody"
        >

        </table>

        <div className={`${styles.sideBar} source`}>
          <div
            className="draggable"
            id="drag-1"
            draggable="true"
            datatype="title"
          >
            titulo
          </div>
          <div
            className="draggable"
            id="drag-2"
            draggable="true"
            datatype="paragraph"
          >
            parrafo
          </div>
          <div className="draggable" id="drag-3" draggable="true">
            drag-3
          </div>
          <div className="draggable" id="drag-4" draggable="true">
            drag-4
          </div>
          <div className="draggable" id="drag-5" draggable="true">
            drag-5
          </div>
        </div>

        <div style={{
          background: '#111',
          color: '#FFF',
          padding:10,
          borderRadius: 10,
          width:200,
          textAlign:'center'
        }}
        onClick={()=> copyCode()}
        >copiar codigo</div>
      </main>
    </>
  );
}
