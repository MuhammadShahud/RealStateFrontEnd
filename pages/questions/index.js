import { useEffect, useState } from "react";
import SideNavbar from "../../components/sideNavbar";
import Header from "../../components/header";
import { useRouter } from "next/router";
import FlashCardModal from "../../components/flashCardModal";
import { state } from "../../valtio/state";
import { useSnapshot } from "valtio";
import Transport from "../../api/transport";

export default function FlashCardSets() {
 
  const [showModal, setShowModal] = useState(false);
  const snap = useSnapshot(state);
  const subjectNames = ['Maths','Science','Geometry','English','Reading','QuestionOfTheDay']
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.length == 0) {
      router.push("/login");
    }
   
  }, [state.flashcards, router.pathname]);
 
  useEffect(() => {
    state.activeTab = 10;
  }, [router.pathname]);


  const toggleModal = (isEdit = false, activeItem = {}) => {
    if (!isEdit) {
      setIsEdit(false);
      setActiveItem({});
    } else {
      setIsEdit(true);
      setActiveItem(activeItem);
    }
    setShowModal(!showModal);
  };


  return (
    <>
      {showModal && (
        <FlashCardModal
          isEdit={isEdit}
          item={activeItem}
          toggleModal={() => {
            toggleModal();
          }}
        />
      )}

      <Header />
      <div className={"flex grid grid-cols-12 w-screen h-screen bg-white-400"}>
        <SideNavbar />
        <div className="flex flex-col col-span-10 custom-scrollbar overflow-auto max-h-[95%] py-50 ">
          <div className="p-10 py-50 flex flex-col ">
            <div className={"h-16 flex items-center justify-between  mb-4"}>
              <div className="pb-2">
                <p className={"text-lg text-bold fs-32"}
                style={{fontSize:"38px"}}
                >SUBJECTS</p>
              </div>
            </div>

            <div
              className={
                "h-16 w-full flex items-center bg-gray-100 pl-4 pr-4 py-5"
              }
            >
              <p
                className={
                  "h-8 w-20 border-r border-gray-300 text-black text-lg font-semibold p-0 m-0 text-center"
                }
              >
                #
              </p>
              <p
                className={
                  "truncate h-8 w-64 text-black text-lg font-semibold ml-4 p-0 m-0"
                }
              >
                Subject
              </p>
             
            </div>

         
              <div className="py-15 mb-15 border flex-col flex ">
                {subjectNames.map((subject, index) => {
                    return (
                      <div
                        onClick={() => {
                          const url = `/questions/${subject}`;
                          console.log("url -->> ", url);
                          router.push(url);
                        }}
                        className={
                          "cursor-pointer h-16 w-full flex items-center bg-white pl-4 pr-4 border-b border-gray-200"
                        }
                      >
                        <p
                          className={
                            "h-8 w-20 border-gray-300 text-gray-600 text-lg  p-0 m-0 text-center"
                          }
                        >
                          {index + 1}
                        </p>

                        <p
                          className={
                            "truncate h-8 w-64 border-gray-300 text-gray-600 text-lg  ml-4 p-0 m-0"
                          }
                        >
                          {subject}
                        </p>
                      
                      </div>
                    );
                  })}
              </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
