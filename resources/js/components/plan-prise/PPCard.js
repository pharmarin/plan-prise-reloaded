import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

import PPInputWrapper from './PPInputWrapper';
import { SPINNER } from '../params';

const PPCard = (props) => {

  const [isOpened, setIsOpened] = useState(false)
  let { async, deleteLine, denomination, customData, customSettings, ...otherProps } = props
  let { isPending, error, data } = async
  let id = props.lineId
  let customeLineData = customData[props.lineId]

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex" onClick={(event) => !event.target.classList.contains('prevent-toggle') && data && setIsOpened(!isOpened)}>
    <div className="d-flex flex-column flex-grow-1" style={{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
    <div className="d-flex">
    <div className="text-truncate">
    {
      isPending ?
      `Chargement de ${denomination} en cours... ` :
      data.custom_denomination
    }
    </div>
    </div>
    {
      data && data.compositions && <div className="text-muted text-truncate">
        <small>{
          data.compositions.map(composition => composition.denomination).join(' + ')
        }</small>
      </div>
    }
    </div>
    <div className="d-flex flex-shrink-0 flex-column">
    {
      isPending ?
      <Button variant="link" size="sm" disabled className="ml-auto" tabIndex="-1">
      <small className="mr-1">Chargement en cours</small>
      { SPINNER }
      </Button> :
      <Button variant="light" size="sm" className="rounded-pill text-danger ml-auto py-0 prevent-toggle" onClick={() => deleteLine(id, denomination)} tabIndex="-1">
      <small className="mr-1 prevent-toggle">Supprimer la ligne</small>
      <i className="fa fa-trash prevent-toggle"></i>
      </Button>
    }
    <Button variant="light" size="sm" className="rounded-pill text-muted ml-auto py-0 mt-1" tabIndex="-1">
    {
      isOpened ?
      <>
      <small className="mr-1">Masquer les détails</small>
      <i className="far fa-caret-square-up"></i>
      </> :
      <>
      <small className="mr-1">Afficher les détails</small>
      <i className="far fa-caret-square-down"></i>
      </>
    }
    </Button>
    </div>
    </Card.Header>
    {
      data && <Card.Body className="row">
      {
        Object.keys(props.inputs).map(
          (sectionKey) => {
            let { inputs } = props
            let section = inputs[sectionKey]
            if (!section.collapse || isOpened) {
              return (
                <div key={sectionKey} className={!isOpened && !section.collapse ? "col-md-12 d-flex justify-content-around" : section.class}>
                {
                  section.inputs.map((input) =>
                  <PPInputWrapper
                  key={input.id}
                  customData={customeLineData}
                  input={input}
                  medicament={data}
                  isShowed={section.collapse ? isOpened : true}
                  {...otherProps}
                  />
                  )
                }
                </div>
                )
              }
            }
            )
          }
          </Card.Body>
        }
        </Card>
        )

      }

      export default PPCard
