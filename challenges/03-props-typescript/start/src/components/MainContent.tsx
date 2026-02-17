// TODO: Import ProjectCard and render three instances from the projects array below.
//       Define the projects array using the ProjectCardProps type from '../types'.

export function MainContent() {
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Welcome to TaskFlow</h2>
        <p className="main-description">
          Select a project from the sidebar to get started, or create a new one.
        </p>
      </div>
    </main>
  )
}

export default MainContent
