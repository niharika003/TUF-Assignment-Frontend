// Construct a form to gather the following fields: username, preferred code language (C++, Java, JavaScript, Python), standard input (stdin), and the source code.
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const languageFunctionMapping = {
  cpp,
  java,
  javascript,
  python,
};

const CodeSnippetForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    language: "JavaScript",
    stdin: "",
    stdout: "",
    source_code: "",
  });

  const [codeMode, setCodeMode] = useState(() => javascript);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "language") {
      const newCodeMode =
        languageFunctionMapping[
          value === "C++" ? "cpp" : value.toLowerCase()
        ] || javascript;
      setCodeMode(() => newCodeMode);
    }
  };

  const onCodeChange = useCallback(
    (value) => {
      setFormData({ ...formData, source_code: value });
    },
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, stdout: "Executing..." });
    let codeOutput;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/execute-code`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      codeOutput = response.data.stdout;
      setFormData({ ...formData, stdout: response.data.stdout });
    } catch (error) {
      if (error.response.status === 503) {
        toast.error(error.response.data.judgeError);
        console.log(error.response.data);
      }
      setFormData({ ...formData, stdout: "Error!" });
      console.error("Failed to execute code: ", error);
    }
    if (!codeOutput) return;

    const encodedSourceCode = btoa(formData.source_code);
    const dataToSend = {
      ...formData,
      source_code: encodedSourceCode,
      stdout: codeOutput,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/snippets`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFormData({
        username: "",
        language: "JavaScript",
        stdin: "",
        source_code: "",
        stdout: "",
      });
    } catch (error) {
      console.error("Failed to submit code snippet:", error);
    }
  };

  return (
    <form className="max-w-sm mx-auto text-left" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Username:
          <input
            type="text"
            name="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </label>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Preferred Code Language:
        </label>
        <select
          name="language"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.language}
          onChange={handleChange}
          required
        >
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Standard Input:
        </label>
        <textarea
          name="stdin"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="stdin"
          value={formData.stdin}
          onChange={handleChange}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Source Code:
        </label>
        <CodeMirror
          className="rounded-lg w-full text-xs"
          theme={vscodeDark}
          value={formData.source_code}
          height="200px"
          extensions={[codeMode()]}
          onChange={onCodeChange}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Standard Output:
        </label>
        <textarea
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.stdout}
          disabled={true}
        />
      </div>
      <div className="flex flex-row justify-between">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:cursor-disabled"
          disabled={formData.stdout === "Executing..."}
        >
          Submit
        </button>
        <button
          onClick={() => {
            navigate("/page2");
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          View Submissions
        </button>
      </div>
    </form>
  );
};

export default CodeSnippetForm;
