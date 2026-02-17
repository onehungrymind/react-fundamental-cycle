// Challenge 26 — Capstone: Feature 1 — Team Member Assignment
//
// A searchable combobox that fetches team members from /api/team
// and allows the user to assign or unassign a team member to a task.
//
// ARIA combobox pattern (WAI-ARIA 1.2):
//   - The text input has role="combobox"
//   - The dropdown list has role="listbox" and id referenced by aria-controls
//   - Each option has role="option" and a unique id
//   - aria-activedescendant on the input tracks the highlighted option
//   - aria-expanded reflects whether the dropdown is open

import {
  useState,
  useRef,
  useEffect,
  useId,
  useMemo,
  useCallback,
} from 'react'
import { useTeam } from '../hooks/queries/useTeam'
import type { TeamMember } from '../mocks/data'

interface TeamMemberSelectProps {
  taskId: string;
  assigneeId: string | undefined;
  onAssign: (taskId: string, assigneeId: string | undefined) => void;
}

export function TeamMemberSelect({
  taskId,
  assigneeId,
  onAssign,
}: TeamMemberSelectProps) {
  const { data: teamMembers = [], isPending } = useTeam()

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const optionIdPrefix = useId()

  // The currently assigned member (for display)
  const selectedMember = useMemo(
    () => teamMembers.find((m) => m.id === assigneeId),
    [teamMembers, assigneeId],
  )

  // Filter members client-side based on what the user has typed
  const filteredMembers = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    if (query === '') return teamMembers
    return teamMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query),
    )
  }, [teamMembers, inputValue])

  // Close dropdown and reset state
  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
    setInputValue('')
  }, [])

  // Select a member by their object
  const selectMember = useCallback(
    (member: TeamMember) => {
      onAssign(taskId, member.id)
      closeDropdown()
    },
    [taskId, onAssign, closeDropdown],
  )

  // Unassign
  const unassign = useCallback(() => {
    onAssign(taskId, undefined)
    closeDropdown()
  }, [taskId, onAssign, closeDropdown])

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        wrapperRef.current !== null &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [closeDropdown])

  // Reset active index when the filtered list changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [filteredMembers])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  function handleInputFocus() {
    setIsOpen(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        return
      }
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < filteredMembers.length - 1 ? prev + 1 : prev,
        )
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < filteredMembers.length) {
          selectMember(filteredMembers[activeIndex])
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        closeDropdown()
        break
      }
    }
  }

  const activeOptionId =
    activeIndex >= 0 ? `${optionIdPrefix}-opt-${activeIndex}` : undefined

  if (isPending) {
    return (
      <div className="team-member-select">
        <span className="team-member-select__label">Assignee:</span>
        <span
          className="team-member-select__loading"
          aria-label="Loading team members"
        >
          Loading...
        </span>
      </div>
    )
  }

  return (
    <div className="team-member-select" ref={wrapperRef}>
      <span className="team-member-select__label" id={`${optionIdPrefix}-label`}>
        Assignee:
      </span>

      {/* Show selected member chip when assigned and dropdown is closed */}
      {selectedMember !== undefined && !isOpen && (
        <div className="team-member-select__selected">
          <img
            src={selectedMember.avatarUrl}
            alt=""
            className="team-member-select__avatar"
            width={20}
            height={20}
            aria-hidden="true"
          />
          <span className="team-member-select__selected-name">
            {selectedMember.name}
          </span>
          <button
            type="button"
            className="team-member-select__clear-btn"
            onClick={unassign}
            aria-label={`Unassign ${selectedMember.name}`}
            title="Unassign"
          >
            &#10005;
          </button>
          <button
            type="button"
            className="team-member-select__change-btn"
            onClick={() => {
              setIsOpen(true)
              setTimeout(() => inputRef.current?.focus(), 0)
            }}
            aria-label="Change assignee"
          >
            Change
          </button>
        </div>
      )}

      {/* Combobox input — shown when unassigned or dropdown is open */}
      {(selectedMember === undefined || isOpen) && (
        <div className="team-member-select__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-activedescendant={activeOptionId}
            aria-labelledby={`${optionIdPrefix}-label`}
            aria-autocomplete="list"
            className="team-member-select__input"
            placeholder={selectedMember !== undefined ? selectedMember.name : 'Search team...'}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          {isOpen && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Team members"
              className="team-member-select__listbox"
            >
              {/* Unassign option */}
              {assigneeId !== undefined && (
                <li
                  role="option"
                  aria-selected={false}
                  className="team-member-select__option team-member-select__option--unassign"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    unassign()
                  }}
                >
                  <span aria-hidden="true">&#10005;</span> Unassign
                </li>
              )}

              {filteredMembers.length === 0 ? (
                <li
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  className="team-member-select__option team-member-select__option--empty"
                >
                  No members match &ldquo;{inputValue}&rdquo;
                </li>
              ) : (
                filteredMembers.map((member, index) => {
                  const optionId = `${optionIdPrefix}-opt-${index}`
                  const isActive = index === activeIndex
                  const isSelected = member.id === assigneeId

                  return (
                    <li
                      key={member.id}
                      id={optionId}
                      role="option"
                      aria-selected={isSelected}
                      className={[
                        'team-member-select__option',
                        isActive ? 'team-member-select__option--active' : '',
                        isSelected ? 'team-member-select__option--selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        selectMember(member)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <img
                        src={member.avatarUrl}
                        alt=""
                        className="team-member-select__option-avatar"
                        width={24}
                        height={24}
                        aria-hidden="true"
                      />
                      <span className="team-member-select__option-info">
                        <span className="team-member-select__option-name">
                          {member.name}
                        </span>
                        <span className="team-member-select__option-role">
                          {member.role}
                        </span>
                      </span>
                      {isSelected && (
                        <span
                          className="team-member-select__option-check"
                          aria-hidden="true"
                        >
                          &#10003;
                        </span>
                      )}
                    </li>
                  )
                })
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default TeamMemberSelect
