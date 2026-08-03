import { useState } from 'react'
import './App.css'
import { Modal } from './components/Modal'
import { Tabs } from './components/Tabs'
import { Disclosure } from './components/Disclosure'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="playground">
      <h1>Accessible Component Playground</h1>
      <p className="sub">Three hand-built ARIA components — keyboard-only test them.</p>

      <section className="card">
        <h2>Modal dialog</h2>
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm action">
          This dialog traps focus, closes on Escape, and returns focus to the button
          that opened it.
        </Modal>
        <p className="hint">Try: open, Tab around (it stays inside), Escape, close and watch focus return.</p>
      </section>

      <section className="card">
        <h2>Tabs</h2>
        <Tabs
          tabs={[
            { label: 'Overview', content: <p>Overview panel. Arrow-right / Arrow-left to move between tabs.</p> },
            { label: 'Details', content: <p>Details panel. Home jumps to the first tab, End to the last.</p> },
            { label: 'Links', content: <p>Links panel. Each tab links to its panel via aria-controls.</p> },
          ]}
        />
      </section>

      <section className="card">
        <h2>Disclosure</h2>
        <Disclosure summary="Why build accessibility by hand?">
          Because AI generates inaccessible components just as fast as good ones.
          Building the three APG patterns by hand is how you learn to review what
          the assistant produces.
        </Disclosure>
        <Disclosure summary="What patterns are these?">
          Modal, tabs, and disclosure — each implemented against the W3C ARIA
          Authoring Practices Guide.
        </Disclosure>
      </section>
    </main>
  )
}

export default App
