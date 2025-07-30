import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify testing environment is working
describe('Test Environment', () => {
  it('should be able to render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>
    
    render(<TestComponent />)
    
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })
})