# Appointment State Machine

## Formal State Transition Table

The `Appointment` entity has a strict lifecycle. Changes to the state must adhere to the following transition table.

| Current State | Next State | Who Can Perform It | Conditions | Audit Event Triggered |
| --- | --- | --- | --- | --- |
| `NULL` (New) | `REQUESTED` | System (Public form), Staff, Admin | Slot is available, valid data. | `APPOINTMENT_CREATE` |
| `REQUESTED` | `CONFIRMED` | Staff, Admin | Doctor assigned, schedule verified. | `APPOINTMENT_UPDATE` |
| `REQUESTED` | `CANCELLED` | Patient (if authenticated), Staff, Admin | Cannot be in past. Requires `cancellationReason`. | `APPOINTMENT_CANCEL` |
| `CONFIRMED` | `CANCELLED` | Staff, Admin | Cannot be in past. Requires `cancellationReason`. | `APPOINTMENT_CANCEL` |
| `CONFIRMED` | `COMPLETED` | Doctor, Staff, Admin | Appointment end time has passed. | `APPOINTMENT_UPDATE` |
| `CONFIRMED` | `NO_SHOW` | Staff, Admin | Patient did not arrive. | `APPOINTMENT_UPDATE` |

## Enforcement
Transitions not defined in this table (e.g., moving from `COMPLETED` back to `REQUESTED`) are strictly forbidden and must be blocked at the service layer.
