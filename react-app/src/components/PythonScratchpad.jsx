import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'personal_python_scratchpad_v1'

const DEFAULT_SNIPPET = `# Personal Python practice scratchpad
# Tip: define your solution and test with quick prints.

class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, value in enumerate(nums):
            need = target - value
            if need in seen:
                return [seen[need], i]
            seen[value] = i
        return []

print(Solution().twoSum([2, 7, 11, 15], 9))
`

const loadPyodideScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pyodide-script="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Unable to load Pyodide runtime.')))
      if (window.loadPyodide) resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js'
    script.async = true
    script.dataset.pyodideScript = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Pyodide runtime.'))
    document.head.appendChild(script)
  })

function PythonScratchpad({ open, onClose }) {
  const initialCode = useMemo(() => {
    if (typeof window === 'undefined') return DEFAULT_SNIPPET
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_SNIPPET
  }, [])

  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('Ready.')
  const [isLoadingRuntime, setIsLoadingRuntime] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const pyodideRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, code)
  }, [code])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const ensurePyodide = async () => {
    if (pyodideRef.current) return pyodideRef.current

    setIsLoadingRuntime(true)
    await loadPyodideScript()
    const pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
    })
    pyodideRef.current = pyodide
    setIsLoadingRuntime(false)
    return pyodide
  }

  const runCode = async () => {
    try {
      setIsRunning(true)
      setOutput('Running...')

      const pyodide = await ensurePyodide()
      let stdout = ''
      let stderr = ''
      pyodide.setStdout({
        batched: (message) => {
          stdout += `${message}\n`
        },
      })
      pyodide.setStderr({
        batched: (message) => {
          stderr += `${message}\n`
        },
      })

      await pyodide.runPythonAsync(code)
      const finalOutput = `${stdout}${stderr ? `\n${stderr}` : ''}`.trim()
      setOutput(finalOutput || '(no output)')
    } catch (error) {
      setOutput(`Execution error:\n${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleEditorKeyDown = (event) => {
    const textarea = event.currentTarget
    const { selectionStart, selectionEnd, value } = textarea
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
    const currentLine = value.slice(lineStart, selectionStart)
    const currentIndent = currentLine.match(/^\s*/)?.[0] ?? ''

    if (event.key === 'Tab') {
      event.preventDefault()

      if (event.shiftKey) {
        const selected = value.slice(selectionStart, selectionEnd)
        const lineHasIndent = value.slice(lineStart, lineStart + 2) === '  '

        if (selectionStart === selectionEnd) {
          if (!lineHasIndent) return
          const updated = value.slice(0, lineStart) + value.slice(lineStart + 2)
          setCode(updated)
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(selectionStart - 2, lineStart)
            textarea.selectionEnd = Math.max(selectionEnd - 2, lineStart)
          })
          return
        }

        const adjustedSelected = selected
          .split('\n')
          .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
          .join('\n')
        const updated = value.slice(0, selectionStart) + adjustedSelected + value.slice(selectionEnd)
        setCode(updated)
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart
          textarea.selectionEnd = selectionStart + adjustedSelected.length
        })
        return
      }

      const updated = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd)
      setCode(updated)
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 2
        textarea.selectionEnd = selectionStart + 2
      })
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const needsExtraIndent = /:\s*$/.test(currentLine)
      const nextIndent = currentIndent + (needsExtraIndent ? '  ' : '')
      const updated = value.slice(0, selectionStart) + `\n${nextIndent}` + value.slice(selectionEnd)
      setCode(updated)
      requestAnimationFrame(() => {
        const nextCursor = selectionStart + 1 + nextIndent.length
        textarea.selectionStart = nextCursor
        textarea.selectionEnd = nextCursor
      })
    }
  }

  if (!open) return null

  return (
    <div className="scratch-backdrop" role="dialog" aria-modal="true" aria-label="Python scratchpad">
      <div className="scratch-panel">
        <div className="scratch-topbar">
          <div>
            <p className="scratch-title">Personal Python Practice Lab</p>
            <p className="scratch-subtitle">No backend, in-browser runtime (Pyodide)</p>
          </div>
          <button type="button" className="scratch-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="scratch-grid">
          <label className="scratch-column">
            <span className="scratch-label">Editor</span>
            <textarea
              className="scratch-editor"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={handleEditorKeyDown}
              spellCheck={false}
            />
          </label>

          <div className="scratch-column">
            <div className="scratch-actions">
              <button
                type="button"
                className="scratch-run"
                onClick={runCode}
                disabled={isLoadingRuntime || isRunning}
              >
                {isLoadingRuntime ? 'Loading runtime...' : isRunning ? 'Running...' : 'Run Python'}
              </button>
              <button type="button" className="scratch-reset" onClick={() => setCode(DEFAULT_SNIPPET)}>
                Reset Template
              </button>
            </div>
            <div className="scratch-output">
              <span className="scratch-label">Output</span>
              <pre>{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PythonScratchpad
