import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LogicPanel } from './WheelspinEngine'

describe('LogicPanel', () => {
  const mockConfig = {
    title: "WHEELSPIN_ENGINE",
    description: "Real-time logic override active.",
    outcomeIndex: 2,
    slices: ["$10", "$2", "$5", "$2", "$10", "$2", "$5", "$2", "$25", "$2", "$10", "$2"]
  }

  it('renders correctly with given config', () => {
    const setConfig = vi.fn()
    const setIsOpen = vi.fn()

    render(
      <LogicPanel
        config={mockConfig}
        setConfig={setConfig}
        isOpen={true}
        setIsOpen={setIsOpen}
      />
    )

    expect(screen.getByText('> LOGIC_CUSTOMIZER')).toBeInTheDocument()
    expect(screen.getByDisplayValue('WHEELSPIN_ENGINE')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument() // outcomeIndex + 1
    expect(screen.getByDisplayValue('$25')).toBeInTheDocument()
  })

  it('updates title when title input changes', () => {
    const setConfig = vi.fn()

    render(
      <LogicPanel
        config={mockConfig}
        setConfig={setConfig}
        isOpen={true}
        setIsOpen={vi.fn()}
      />
    )

    const titleInput = screen.getByDisplayValue('WHEELSPIN_ENGINE')
    fireEvent.change(titleInput, { target: { value: 'NEW_TITLE' } })

    expect(setConfig).toHaveBeenCalledWith({
      ...mockConfig,
      title: 'NEW_TITLE'
    })
  })

  it('updates outcomeIndex when outcome input changes', () => {
    const setConfig = vi.fn()

    render(
      <LogicPanel
        config={mockConfig}
        setConfig={setConfig}
        isOpen={true}
        setIsOpen={vi.fn()}
      />
    )

    const outcomeInput = screen.getByDisplayValue('3')
    fireEvent.change(outcomeInput, { target: { value: '5' } })

    // UI shows index + 1, so changing input to 5 sets index to 4
    expect(setConfig).toHaveBeenCalledWith({
      ...mockConfig,
      outcomeIndex: 4
    })
  })

  it('updates slices when slice inputs change', () => {
    const setConfig = vi.fn()

    render(
      <LogicPanel
        config={mockConfig}
        setConfig={setConfig}
        isOpen={true}
        setIsOpen={vi.fn()}
      />
    )

    // Find the first slice input which is "$10"
    const sliceInputs = screen.getAllByDisplayValue('$10')
    const firstSliceInput = sliceInputs[0]

    fireEvent.change(firstSliceInput, { target: { value: '$100' } })

    const expectedSlices = [...mockConfig.slices]
    expectedSlices[0] = '$100'

    expect(setConfig).toHaveBeenCalledWith({
      ...mockConfig,
      slices: expectedSlices
    })
  })
})
