import React, { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { ValidationResults, Policy } from 'onroute-policy-engine'
import ValidationResultsDisplay from './ValidationResults'
import ValidationMethodSelector from './ValidationMethodSelector'
import CompanyInformationSection from './CompanyInformationSection'
import ContactDetailsSection from './ContactDetailsSection'
import MailingAddressSection from './MailingAddressSection'
import VehicleDetailsSection from './VehicleDetailsSection'
import TripDetailsSection from './TripDetailsSection'
import PermittedRouteSection from './PermittedRouteSection'
import VehicleConfigurationSection from './VehicleConfigurationSection'
import FormSelect from './FormSelect'
import { usePermitForm } from '../hooks/usePermitForm'
import './PermitForm.css'

interface PermitFormProps {
  onSubmit: (permitData: any, validationMethod: 'local' | 'api') => void
  validationResults?: ValidationResults | null
  policy?: Policy | null
  permitApplication?: any
}

const PermitForm: React.FC<PermitFormProps> = ({ onSubmit, validationResults, policy, permitApplication }) => {
  const [validationMethod, setValidationMethod] = useState<'local' | 'api'>('local')
  const {
    form,
    handleSubmit,
    permitTypes,
    vehicleSubTypes,
    collapsedSections,
    showVehicleConfig,
    showSizeDimensions,
    showWeightDimensions,
    trailerTypes,
    commodityTypes,
    selectedTrailers,
    axleConfigurations,
    toggleSection,
    handleTrailerChange,
    removeTrailer,
    handleAxleConfigurationChange
  } = usePermitForm({ 
    policy, 
    onSubmit: (permitData: any) => onSubmit(permitData, validationMethod) 
  })

  return (
    <div className="permit-form">
      <ValidationMethodSelector
        validationMethod={validationMethod}
        onValidationMethodChange={setValidationMethod}
      />
      <div className="form-content-wrapper">
        <div className="left-column">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit}>
              <div className="form-content">
              <div className="form-group">
                <FormSelect
                  name="permitType"
                  label="Permit Type"
                  options={permitTypes.length > 0 ? permitTypes : [
                    ['STOS', 'Single Trip Oversize (STOS)'],
                    ['TROS', 'Trip Oversize (TROS)'],
                    ['LCV', 'Long Combination Vehicle (LCV)']
                  ]}
                  required
                />
              </div>

              <CompanyInformationSection
                isCollapsed={collapsedSections.has('company')}
                onToggleCollapse={() => toggleSection('company')}
              />

              <ContactDetailsSection
                isCollapsed={collapsedSections.has('contact')}
                onToggleCollapse={() => toggleSection('contact')}
              />

              <MailingAddressSection
                isCollapsed={collapsedSections.has('mailing')}
                onToggleCollapse={() => toggleSection('mailing')}
              />

              <VehicleDetailsSection
                isCollapsed={collapsedSections.has('vehicle')}
                onToggleCollapse={() => toggleSection('vehicle')}
                vehicleSubTypes={vehicleSubTypes}
              />

              <TripDetailsSection
                isCollapsed={collapsedSections.has('trip')}
                onToggleCollapse={() => toggleSection('trip')}
              />

              <PermittedRouteSection
                isCollapsed={collapsedSections.has('route')}
                onToggleCollapse={() => toggleSection('route')}
              />

              {showVehicleConfig && (
                <VehicleConfigurationSection
                  isCollapsed={collapsedSections.has('vehicleConfig')}
                  onToggleCollapse={() => toggleSection('vehicleConfig')}
                  showSizeDimensions={showSizeDimensions}
                  showWeightDimensions={showWeightDimensions}
                  selectedTrailers={selectedTrailers}
                  onTrailerChange={handleTrailerChange}
                  onRemoveTrailer={removeTrailer}
                  trailerTypes={trailerTypes}
                  commodityTypes={commodityTypes}
                  axleConfigurations={axleConfigurations}
                  onAxleConfigurationChange={handleAxleConfigurationChange}
                />
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Validate Permit
              </button>
            </div>
            </form>
          </FormProvider>
        </div>

        <div className="right-column">
          {validationResults && (
            <ValidationResultsDisplay 
              results={validationResults} 
              permitType={form.watch('permitType')} 
              permitApplication={permitApplication || form.getValues()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PermitForm
