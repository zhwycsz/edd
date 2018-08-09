# coding: utf-8
from rest_framework import serializers

from .. import models
from edd.rest.serializers import UpdateSerializer


class BaseImportObjectSerializer(serializers.ModelSerializer):
    created = UpdateSerializer(read_only=True)
    pk = serializers.IntegerField(read_only=True)
    updated = UpdateSerializer(read_only=True)
    uuid = serializers.UUIDField(format='hex_verbose', read_only=True)

    class Meta:
        model = models.BaseImportModel
        fields = (
            'active',
            'created',
            'description',
            'name',
            'pk',
            'updated',
            'uuid',
        )


class ImportFormatSerializer(BaseImportObjectSerializer):
    class Meta:
        model = models.ImportFormat


class ImportCategorySerializer(BaseImportObjectSerializer):

    class Meta:
        model = models.ImportCategory
        depth = 1
        fields = BaseImportObjectSerializer.Meta.fields + (
            'display_order',
            'protocols',
            'file_formats',
        )


class FileImportSerializer(BaseImportObjectSerializer):

    class Meta:
        model = models.Import
        depth = 0
        fields = BaseImportObjectSerializer.Meta.fields + (
            'study',
            'status',
            'category',
            'protocol',
            'file_format',
            'x_units',
            'y_units',
            'compartment',
            'meta_store',
        )
        read_only_fields = ('study', 'status', )
