import { useEffect, useRef, useState } from "react";
import SideNavbar from "../../components/sideNavbar";
import Header from "../../components/header";
import { useRouter } from "next/router";
import { state } from "../../valtio/state";
import Transport from "../../api/transport";
import { toast } from "react-toastify";


export default function FlashcardDetails(props) {
  const router = useRouter();
  const { id: subject } = router.query;

  const [questions, setQuestions] = useState();
  const [showModal, setShowModal] = useState(false);
  const [getEffect, setGetEffect] = useState(false);
  const initialState = {
    id: "",
    question: "",
   setId:"",
      category: Number,
        answer: "",
          premium: false,
            options: ['', '', '', '']
}
  const [newQuestion, setNewQuestion] = useState(initialState);
  const myInp = useRef(null);
  const [updateQ, setUpdateQ] = useState(false)
  const [loading, setLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  

  useEffect(() => {
    setLoading(true)
    if (subject) {
      Transport.HTTP.getQuestions(
        subject,
      )
        .then((res) => {

          const response = res.data.results;
          setQuestions(response);
      

          setLoading(false);
        })
        .catch((err) => {
          alert(err);
          props.toggleModal();
          setLoading(false);
        });
    }
  }, [router,getEffect]);

  useEffect(() => {
    if (sessionStorage.length == 0) {
      router.push("/login");
    }
  }, [questions]);

  useEffect(() => {
    state.activeTab = 10;
  }, [router.pathname]);

  const createQuestion = () => {
  delete newQuestion.id;
  
    setIsOperationLoading(true)
    Transport.HTTP.createQuestion(
      newQuestion,
      sessionStorage.getItem("token")
    )
      .then((res) => {
        toast.success("New Question Has Been Added Successfully", {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsOperationLoading(false)
        setGetEffect(!getEffect)
        setNewQuestion(initialState)
      })
      .catch((err) => {
        toast.error(`There is An error`, {
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsOperationLoading(false)
      });
  };
  const editQuestion = (question) => {
    setNewQuestion((Q) => ({
      ...Q,
      id: question.id,
      question: question.question,
      answer: question.answer,
      category: question.category,
      premium: question.premium,
      options: [question.options[0], question.options[1], question.options[2], question.options[3]],
      subject: subject
    }))
    setUpdateQ(true)
    myInp.current.focus()

  }

const updateQuestion = ()=>{
  setIsOperationLoading(true)
  Transport.HTTP.updateQuestion(
    newQuestion,
  )
  .then((res) => {
      toast.info("Question Has Been Updated Successfully", {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    setIsOperationLoading(false)
    setGetEffect(!getEffect)
    setNewQuestion(initialState)

    })
}


  console.log(newQuestion);

  const deleteQuestion = (id) => {
    console.log('Working');
    const del = confirm("Are Your Sure you want to delete?").valueOf();
    if (del) {
      Transport.HTTP.deleteQuestion(
        id,
        sessionStorage.getItem("token")
      )
        .then((res) => {
          toast.success("Question Has Been Deleted Successfully", {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setGetEffect(!getEffect)

        })
        .catch((err) => {
          toast.error(`There is An error`, {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

        });
    }
  };

  

  const callForOptions = (e, index) => {
    const option = [...newQuestion.options]
    option[index] = e.target.value
     setNewQuestion({
       ...newQuestion,
       options : option,
       subject: subject
     })
  }
 

  return (
    <>
      <Header />
      <div className={"flex grid grid-cols-12 w-screen h-screen bg-white-400"}>
        <SideNavbar />
        {showModal && (
          <Modal
            button1Action={() => {
              setShowModal(false);
            }}
            button1Text={"Close"}
            title={"Warning"}
            body={"Invalid Email/Password"}
          />
        )}

        <div className="custom-scrollbar overflow-auto max-h-[95%] p-10 flex flex-col col-span-10">

          <div className="flex flex-col px-6 py-5">

            <div className={"h-16 flex items-center justify-between  mb-4"}>
              <div className="pb-2">
                <p className="font-semibold text-gray-800">Questions Detail</p>
              </div>
              <div className="flex flex-row justify-between">
                <button
                  onClick={updateQ? updateQuestion : createQuestion}
                  disabled={isOperationLoading}
                  className={
                    "disabled:bg-blue-100 disabled:cursor-not-allowed mx-2 h-12 rounded w-40 font-bold  flex items-center justify-center rounded-sm " + (updateQ ? "bg-red-500" :"bg-blue-500")
                  }
                  
                >
                  <p className={"text-lg text-white"}>
                   {updateQ? "Update Question": "Create Question"}
                  </p>
                </button>
              </div>
            </div>

            <div className="flex flex-col px-6 py-5">
              <p className="mb-2 font-semibold text-gray-700">Question</p>
              <textarea
                ref={myInp}
                onChange={(e) =>
                  setNewQuestion((Q) => ({
                    ...Q,
                    question: e.target.value,
                  }))
                }
                value={newQuestion.question}
                type="text"
                name=""
                placeholder="Type Question"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-24"
                id=""
              ></textarea>
              <p className="mb-2 font-semibold text-gray-700">Answer</p>
              <textarea
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion((Q) => ({
                    ...Q,
                    answer: e.target.value,
                  }))
                }
                type="text"
                name=""
                placeholder="Type Answer"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-24"
                id=""
              ></textarea>
              <p className="mb-2 font-semibold text-gray-700">Category</p>
              <input
                value={newQuestion.category}
                onChange={(e) =>
                  setNewQuestion((Q) => ({
                    ...Q,
                    category: e.target.value,
                  }))
                }
                type="text"
                name=""
                placeholder="Type Category"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-12"
                id=""
              />
              <p className="mb-2 font-semibold text-gray-700">Option One</p>
              <input
                value={newQuestion.options[0]}
                onChange={(e) =>
                  callForOptions(e, 0)
                }
                type="text"
                name=""
                placeholder="Type Option One"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-12"
                id=""
              />
              <p className="mb-2 font-semibold text-gray-700">Option Two</p>
              <input
                value={newQuestion.options[1]}
                onChange={(e) => callForOptions(e, 1)}
                type="text"
                name=""
                placeholder="Type Option Two"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-12"
                id=""
              />
              <p className="mb-2 font-semibold text-gray-700">Option Three</p>
              <input
                value={newQuestion.options[2]}
                onChange={(e) =>
                  callForOptions(e, 2)
                }
                type="text"
                name=""
                placeholder="Type Option Three"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-12"
                id=""
              />
              <p className="mb-2 font-semibold text-gray-700">Option Four</p>
              <input
                value={newQuestion.options[3]}
                onChange={(e) =>
                  callForOptions(e, 3)
                }
                type="text"
                name=""
                placeholder="Type Option Four"
                className="p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-12"
                id=""
              />
              <p className="mb-2 font-semibold text-gray-700">
                Subscription Type
              </p>
              <select
                value={newQuestion.premium? "premium":"free"}
                onChange={(e) => {
                  setNewQuestion((Q) => ({
                    ...Q,
                    premium: e.target.value === 'free' ? false : true,
                  }));
                  console.log('end',newQuestion);
                }

                }
                type="text"
                name=""
                className="w-full p-3 mb-5 bg-white border border-gray-200 rounded shadow-sm appearance-none"
                id=""
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>

              <hr />
            </div>

            <div className="flex flex-row justify-center py-6">
              <p className="mb-2 font-semibold text-gray-700 "
                style={{ fontSize: "24px" }}>Questions</p>

            </div>
            <div className="flex flex-col divide-y divide-blue-200">
              {loading ? (
                <div className="flex w-full items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 mt-5 border-b-4 border-blue-500" />
                </div>
              ) : questions.map((question, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row border-b py-2 items-center "
                  >
                    <div className="w-full justify-between pr-3">
                      <p className="mb-2 font-semibold text-gray-700">
                        Question
                      </p>
                      <textarea
                        value={question.question}
                        disabled={true}
                        type="text"
                        name=""
                        placeholder="Type back description..."
                        className="w-full p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-24"
                        id=""
                      ></textarea>
                    </div>

                    <div className="w-full justify-between pl-3">
                      <p className="mb-2 font-semibold text-gray-700">
                        Answer
                      </p>
                      <textarea
                        value={question.answer}
                        disabled={true}
                        type="text"
                        name=""
                        placeholder="Type back description..."
                        className="w-full p-5 mb-5 bg-white border border-gray-200 rounded shadow-sm h-24"
                        id=""
                      ></textarea>
                    </div>
                    <div className="pl-3">
                      <button onClick={() => deleteQuestion(question.id)}>
                        <svg
                          width="30"
                          height="30"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          className="text-red-400"
                        >
                          <g>
                            <g xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <path
                                  d="M62.205,150l26.569,320.735C90.678,493.865,110.38,512,133.598,512h244.805c23.218,0,42.92-18.135,44.824-41.265    L449.795,150H62.205z M180.986,452c-7.852,0-14.458-6.108-14.956-14.063l-15-242c-0.513-8.276,5.771-15.395,14.033-15.908    c8.569-0.601,15.381,5.757,15.908,14.033l15,242C196.502,444.632,189.721,452,180.986,452z M271,437c0,8.291-6.709,15-15,15    c-8.291,0-15-6.709-15-15V195c0-8.291,6.709-15,15-15s15,6.709,15,15V437z M360.97,195.938l-15,242    c-0.493,7.874-7.056,14.436-15.908,14.033c-8.262-0.513-14.546-7.632-14.033-15.908l15-242    c0.513-8.276,7.764-14.297,15.908-14.033C355.199,180.543,361.483,187.662,360.97,195.938z"
                                  fill="#8F3A93"
                                  data-original="#8F3A93"
                                  className=""
                                ></path>
                              </g>
                            </g>
                            <g xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <path
                                  d="M451,60h-90V45c0-24.814-20.186-45-45-45H196c-24.814,0-45,20.186-45,45v15H61c-16.569,0-30,13.431-30,30    c0,16.567,13.431,30,30,30c137.966,0,252.039,0,390,0c16.569,0,30-13.433,30-30C481,73.431,467.569,60,451,60z M331,60H181V45    c0-8.276,6.724-15,15-15h120c8.276,0,15,6.724,15,15V60z"
                                  fill="#FB3A93"
                                  data-original="#8F3A93"
                                  className=""
                                ></path>
                              </g>
                            </g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                            <g xmlns="http://www.w3.org/2000/svg"></g>
                          </g>
                        </svg>
                      </button>



                      <button onClick={() => editQuestion(question)}>
                        <img src={'/pencil.png'}
                          height={30}
                          width={30} />
                      </button>


                    </div>
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
