<?php

namespace App\JsonApi\CustomRelations;

use CloudCreativity\LaravelJsonApi\Adapter\AbstractRelationshipAdapter;
use CloudCreativity\LaravelJsonApi\Contracts\Adapter\HasManyAdapterInterface;
use CloudCreativity\LaravelJsonApi\Eloquent\Concerns\QueriesRelations;
use Neomerx\JsonApi\Contracts\Encoder\Parameters\EncodingParametersInterface;

class ExternalAPI extends AbstractRelationshipAdapter implements
  HasManyAdapterInterface
{
  use QueriesRelations;

  /**
   * @var string
   */
  protected $key;

  /**
   * BelongsTo constructor.
   *
   * @param string $key
   */
  public function __construct($key)
  {
    $this->key = $key;
  }

  /**
   * Query related resources for the specified domain record.
   *
   * For example, if a client was querying the `comments` relationship of a `posts` resource.
   * This method would be invoked providing the post that is being queried as the `$record` argument.
   *
   * @param mixed $record
   * @param EncodingParametersInterface $parameters
   * @return mixed
   */
  public function query($record, EncodingParametersInterface $parameters)
  {
    dd('query');
  }

  /**
   * Add data to a domain record's relationship using data from the supplied relationship object.
   *
   * For a has-many relationship, this adds the resource identifiers in the relationship to the domain
   * record's relationship. It is not valid for a has-one relationship.
   *
   * @param mixed $record
   * @param array $relationship
   *      The JSON API relationship object.
   * @param EncodingParametersInterface $parameters
   * @return object
   *      the updated domain record.
   */
  public function add(
    $record,
    array $relationship,
    EncodingParametersInterface $parameters
  ) {
    dd('add');
  }

  /**
   * Remove data from a domain record's relationship using data from the supplied relationship object.
   *
   * For a has-many relationship, this removes the resource identifiers in the relationship from the
   * domain record's relationship. It is not valid for a has-one relationship, as `update()` must
   * be used instead.
   *
   * @param mixed $record
   * @param array $relationship
   *      The JSON API relationship object.
   * @param EncodingParametersInterface $parameters
   * @return object
   *      the updated domain record.
   */
  public function remove(
    $record,
    array $relationship,
    EncodingParametersInterface $parameters
  ) {
    dd('remove');
  }

  /**
   * Update a domain record's relationship when filling a resource's relationships.
   *
   * For a has-one relationship, this changes the relationship to match the supplied relationship
   * object.
   *
   * For a has-many relationship, this completely replaces every member of the relationship, changing
   * it to match the supplied relationship object.
   *
   * @param mixed $record
   * @param array $relationship
   *      The JSON API relationship object.
   * @param EncodingParametersInterface $parameters
   * @return object
   *      the updated domain record.
   */
  public function update(
    $record,
    array $relationship,
    EncodingParametersInterface $parameters
  ) {
    $cis_array = array_map(function ($relation) {
      return intval($relation['id']);
    }, $relationship['data']);

    $record->{$this->key} = $cis_array;
    $record->save();
  }

  /**
   * Replace a domain record's relationship with data from the supplied relationship object.
   *
   * @param mixed $record
   * @param array $relationship
   *      The JSON API relationship object.
   * @param EncodingParametersInterface $parameters
   * @return object
   *      the updated domain record.
   */
  public function replace(
    $record,
    array $relationship,
    EncodingParametersInterface $parameters
  ) {
    dd('replace');
  }
}
